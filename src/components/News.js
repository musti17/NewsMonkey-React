import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



const News = (props) => {

  const [articles,setArticles] = useState([])
  const [loading,setLoading] = useState(true)
  const [page,setPage] = useState(1)
  const [totalResults,setTotalResults] = useState(0)
  // document.title = `${this.capitalizeFirstLetter(props.category)} - NewsMonkey`;

  const updateNews= async()=> {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=f6374bd17f224da7890baad0d35f635b&page=${page}&pageSize=${props.pageSize}`;//url of news api
    setLoading(true);
    let data = await fetch(url);//fetches news from above api url and waits for promise(i.e to fetch news) to resolve//
    props.setProgress(30);
    let parsedData = await data.json();//waits for promise to resolve
    props.setProgress(70);
    console.log(parsedData);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(()=>{
    updateNews();
  },[])

  //Function to fetch api//

  const handlePrevClick = async () => {
    setPage(page-1)
    updateNews();
  }

  const handleNextClick = async () => {
    setPage(page+1)
    updateNews();
  }

  const fetchMoreData = async () => { 
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=f6374bd17f224da7890baad0d35f635b&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)//takes time to get updated as async function
    let data = await fetch(url);
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

    return (
      <>
        <h2 className="text-center" style={{margin:'35px 0px',marginTop:'90px'}}>News Monkey-Top {capitalizeFirstLetter(props.category)} Headlines</h2>
         {loading && <Spinner/>}  
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="container">

            <div className="row">
              {articles.map((element) => {
                return <div className="col-md-4" key={element.url}>
                  <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage ? element.urlToImage : "https://c.ndtvimg.com/2020-05/3q2pkpmo_maharashtra-governor-bs-koshyari-facebook_625x300_25_May_20.jpg"}
                    newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>

        {/* <div className="container d-flex justify-content-between my-4">
        <button type="button" disabled={this.state.page<=1} className="btn btn-dark" onClick={this.handlePrevClick}> &larr; Prev</button>
        <button type="button" disabled={this.state.page+1 > Math.ceil(this.state.totalResults/props.pageSize)} className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div> */}
      </>
    )
  
}

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general"
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News

