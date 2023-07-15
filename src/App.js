import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import Rank from './Components/Rank/Rank'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
import ParticlesDisplay from './Components/ParticleDisplay/ParticleDisplay'
import SignIn from './Components/SignIn/SignIn'
import Register from './Components/Rank/Rank'

import React from 'react'
import { Component } from 'react'

import './App.css'

class App extends Component {
  constructor () {
    super()
    this.state = { input: '', imageURL: '', box: {}, route: 'signin' }
  }

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage')
    const width = Number(image.width)
    const height = Number(image.height)
    console.log(width, height)

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    }
  }

  displayFaceBox = box => {
    console.log(box)
    this.setState({ box: box })
  }

  onInputChange = event => {
    this.setState({ input: event.target.value })
  }

  getRequestOptions = () => {
    // fetch the URL from the text field
    this.setState({ imageURL: this.state.input })
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '5ee7cac460a2473f8c6a1eae5a802af3'
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'yuuxoon'
    const APP_ID = 'FaceDetect'
    // const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40'
    const IMAGE_URL = this.state.input
    // -------------------------------------------------------------------------------------------------------------------------

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL
            }
          }
        }
      ]
    })

    return {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + PAT
      },
      body: raw
    }
  }

  onButtonSubmit = event => {
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection'
    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch(
      'https://api.clarifai.com/v2/models/' + MODEL_ID + '/outputs',
      this.getRequestOptions()
    )
      .then(response => response.json())
      .then(result => {
        this.displayFaceBox(this.calculateFaceLocation(result))
      })
      .catch(error => console.log('error', error))

    // -------------------------------------------------------------------------------------------------------------------------
  }

  onRouteChange = route => {
    this.setState({ route: route })
  }

  // -------------------------------------------------------------------------------------------------------------------------
  // The rendering happens here
  render () {
    return (
      <div className='App'>
        <ParticlesDisplay />
        <Navigation onRouteChange={this.onRouteChange} />
        {this.state.route === 'signin' ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={this.state.box}
              imageURL={this.state.imageURL}
            />
          </div>
        )}
      </div>
    )
  }
}

export default App
