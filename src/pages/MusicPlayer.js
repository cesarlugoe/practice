import React, { Component } from "react";
import itunesServer from "../lib/ItunesService";
import SocialSharing from "../components/SocialSharing";

export default class MusicPlayer extends Component {
  state = {
    song: {},
    isLoading: true,
    currentSongIndex: null,
    queryResults: {}
  };

  componentDidMount = () => {
    const currentSongIndex = this.props.location.state.index;
    const queryResults = this.props.location.state.songList;

    this.setState(
      {
        isLoading: true,
        currentSongIndex,
        queryResults
      },
      () => this.findTune()
    );
  };

  findTune = () => {
    const { currentSongIndex } = this.state;
    const { songList } = this.props.location.state;
    const songId = songList[currentSongIndex].trackId;

    itunesServer.findTuneById(songId).then(tunesResponse => {
      const song = tunesResponse.data.results[0];
      this.setState({
        song,
        isLoading: false
      });
    });
  };

  handleChangeSong = value => {
    let { currentSongIndex } = this.state;
    let direction;

    // Conditional evaluates if its the beggining of the playlist, if so 'previous' has no effect.

    if (currentSongIndex > 0 || value === "next") {
      value === "next" ? (direction = 1) : (direction = -1);
      currentSongIndex += direction;
      this.setState(
        {
          currentSongIndex
        },
        () => this.findTune()
      );
    }
  };

  handleBackButton = () => {
    const { queryResults } = this.state;
    this.props.history.push({
      pathname: `/`,
      state: { queryResults }
    });
  };

  render() {
    const { song, isLoading, queryResults } = this.state;

    return (
      <div className=" container player-main ">
        {isLoading ? (
          <h1>...Loading</h1>
        ) : (
          <div className=" music-player container ">
            <button onClick={() => this.handleBackButton(queryResults)}>
              back
            </button>

            <p>{song.artistName}</p>
            <img src={song.artworkUrl100} alt={song.collectionName} />
            <p>{song.trackName}</p>

            <audio controls src={song.previewUrl} />

            <div className=" change-controlers ">
              <button onClick={() => this.handleChangeSong("previous")}>
                previous
              </button>
              <button onClick={() => this.handleChangeSong("next")}>
                next
              </button>
            </div>
            <SocialSharing content={song} />
          </div>
        )}
      </div>
    );
  }
}
