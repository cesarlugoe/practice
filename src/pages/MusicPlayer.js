
import React, { Component } from 'react'
import itunesServer from '../lib/ItunesService';
import SocialSharing from '../components/SocialSharing';

export default class MusicPlayer extends Component {

  state = {
    song: {},
    isLoading: true,
    currentSongIndex: Number,
    queryResults:{},
  }

  componentDidMount = () => {
    this.setState({
      isLoading: true,
      currentSongIndex: this.props.location.state.index,
      queryResults: this.props.location.state.songList,
    }, () => this.findTune());

  }

  findTune = () => {
    const { currentSongIndex } = this.state;
    const songId = this.props.location.state.songList[currentSongIndex].trackId;

    itunesServer.findTuneById(songId)
    .then( tunesResponse => {
      const song = tunesResponse.data.results[0];
      this.setState({
        song,
        isLoading: false,
      })
    })
  }

  handleChangeSong = (value) => {
    let direction;
    value === 'next'? direction = 1 : direction = -1 ;
    if (this.state.currentSongIndex > 0 || direction === 1) {
      const currentSongIndex = this.state.currentSongIndex + direction;
      this.setState({
        currentSongIndex,
      }, () => this.findTune())
    } 
  }

  handleBackButton = () => {
    const { queryResults } = this.state;
    this.props.history.push({
      pathname: `/`,
      state: { queryResults },
    });
  }

  render() {
    const { song, isLoading, queryResults } = this.state;
    return (
      <div>
        {isLoading? <h1>...Loading</h1> 
          : <div className=" music-player container ">
              <button onClick={() => this.handleBackButton(queryResults)}>back</button>
              <p>{song.artistName}</p>
              <img src={song.artworkUrl100} alt={song.collectionName}></img>
              <p>{song.trackName}</p>
              <audio 
                controls
                src={song.previewUrl}>
              </audio>
              <div className=" change-controlers ">
                <button onClick={(e) => this.handleChangeSong('previous', e)}>previous</button>
                <button onClick={(e) => this.handleChangeSong('next', e)}>next</button>
              </div>
              <SocialSharing content={song}/>
            </div>
        }   
      </div>
    )
  }
}