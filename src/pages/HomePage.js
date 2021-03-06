import React, { Component } from "react";
import SearchBar from "../components/SearchBar";
import itunesServer from "../lib/ItunesService";
import List from "../components/List";

export default class HomePage extends Component {
    state = {
      tunesQueryData: [],
      isSearching: false,
      searchSuccess: null
    };
  

  componentDidMount = () => {
    this.checkSearchCache();
  };

  handleTunesSearch = query => {
    this.setState({
      isSearching: true
    });

    itunesServer
      .findTunes(query)
      .then(tunesResponse => {
        const tunesQueryData = tunesResponse.data.results;
        const searchSuccess = tunesQueryData.length > 0 ? true : false;

        this.setState({
          tunesQueryData,
          isSearching: false,
          searchSuccess
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  displaySearchResult = () => {
    const { searchSuccess, tunesQueryData } = this.state;

    if (searchSuccess === true) {
      return <List tunesQueryData={tunesQueryData} />;
    }
    if (searchSuccess === false) {
      return <h4> No results came up from your search </h4>;
    }
  };


  checkSearchCache = () => {
    // TDD software woudn't read ...location.state if location is undefined.
    const checkCache = this.props.location ? this.props.location.state : null;
    const songListFromPlayer = checkCache ? checkCache.queryResults : null;

    if (songListFromPlayer) {
      this.setState({
        tunesQueryData: songListFromPlayer,
        searchSuccess: true
      });
    }
  };

  render() {
    const { isSearching } = this.state;

    return (
      <div className=" main-page container ">
        <SearchBar handleSearch={this.handleTunesSearch} />
        {isSearching ? (
          <img src="/5.gif" alt="gif" />
        ) : (
          this.displaySearchResult()
        )}
      </div>
    );
  }
}
