import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import {
  StoriesContainer,
  Stories,
  SlickItem,
  StoryImage,
  StoryName,
  MainContainer,
} from './styledComponents'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class InstaStories extends Component {
  state = {apiStatus: apiStatusConstants.loading, storiesList: []}

  componentDidMount() {
    this.getStories()
  }

  getStories = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    const data = await response.json()
    if (response.ok === true) {
      this.setState({apiStatus: apiStatusConstants.success})
      console.log(data)
      const updatedData = data.users_stories.map(each => ({
        userId: each.user_id,
        storyUrl: each.story_url,
        userName: each.user_name,
      }))
      this.setState({storiesList: updatedData})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <>
      <div>
        <h1>fail</h1>
      </div>
    </>
  )

  renderLoadingView = () => (
    <>
      <div className="story-loader">
        <Loader type="TailSpin" height={50} width={50} color="#0799fa" />
      </div>
    </>
  )

  renderSuccessView = () => {
    const {storiesList} = this.state
    const {isDarkTheme} = this.props
    const settings = {
      dots: false,
      slidesToShow: 6,
      infinite: false,
      speed: 500,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 7,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 2,
          },
        },
      ],
    }
    return (
      <>
        <Stories>
          <StoriesContainer>
            <Slider {...settings}>
              {storiesList.map(each => (
                <SlickItem key={each.userId}>
                  <StoryImage src={each.storyUrl} alt="user story" />
                  <StoryName isDarkTheme={isDarkTheme}>
                    {each.userName}
                  </StoryName>
                </SlickItem>
              ))}
            </Slider>
          </StoriesContainer>
        </Stories>
      </>
    )
  }

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {isDarkTheme} = this.props
    return (
      <MainContainer isDarkTheme={isDarkTheme}>
        {this.renderViews()}
      </MainContainer>
    )
  }
}

export default InstaStories
