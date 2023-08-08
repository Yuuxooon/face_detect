import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import Rank from './Components/Rank/Rank'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
// import ParticlesDisplay from './Components/ParticleDisplay/ParticleDisplay'
import SignIn from './Components/SignIn/SignIn'
import Register from './Components/Register/Register'

import React from 'react'
import { Component } from 'react'

import './App.css'

class App extends Component {
  constructor () {
    super()
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
    setTimeout(() => {
      console.log('user loaded: ', this.state.user, data)
    }, 1000)
  }

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.querySelector('#inputImage') // for whatever reason this fails to get the object when the image is first rendered
    console.log(document.querySelector('#inputImage'), this.state.imageURL)
    // some debugging here
    console.log('There should be some data, an image to be exact: ', image)
    console.log('Some numbers', image.height, image.width)
    // ------------------------
    const width = Number(image.width)
    const height = Number(image.height)
    console.log(width, height) // those should be numbers

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

  onRouteChange = route => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false })

      Object.assign(this.state, { imageURL: '' })
      Object.assign(this.state, { box: {} })
      Object.assign(this.state, {
        user: {
          id: '',
          name: '',
          email: '',
          password: '',
          entries: 0,
          joined: ''
        }
      })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  onButtonSubmit = event => {
    Object.assign(this.state, { imageURL: this.state.input })
    fetch('http://localhost:3000/image', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageURL: this.state.imageURL })
    })
      .then(response => response.json())
      .then(result => {
        if (result) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: this.state.user.id })
          })
            .then(response => response.json())
            .then(entries => {
              console.log(entries)
              this.setState(
                Object.assign(this.state.user, { entries: entries })
              )
            })
        }
        this.displayFaceBox(this.calculateFaceLocation(result))
      })

      .catch(error => console.log('error', error))

    // -------------------------------------------------------------------------------------------------------------------------
  }

  // -------------------------------------------------------------------------------------------------------------------------
  // The rendering happens here
  render () {
    const { imageURL, isSignedIn, route, box } = this.state
    return (
      <div className='App'>
        {/* <ParticlesDisplay /> */}
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageURL={imageURL} />
          </div>
        ) : route === 'signin' || route === 'signout' ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    )
  }
}

export default App
