import { useState } from "react";
import Layout from "../layout";
import { Input, Card, Loading, Pagination } from "../../components";
import {
  useGetDiscoverMovieQuery,
  useGetMovieByKeywordQuery,
} from "../../redux/services/movieApi";
import { BarLoader } from "react-spinners";

export default function Landing() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviePerPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  const {
    data: dataDiscoverMovie,
    error: errorDiscoverMovie,
    isFetching: isFetchingDiscoverMovie,
  } = useGetDiscoverMovieQuery();

  const {
    data: dataMovieByKeyword,
    error: errorMovieByKeyword,
    isFetching: isFetchingMovieByKeyword,
    refetch: refetchMovieByKeyword,
  } = useGetMovieByKeywordQuery({
    keyword,
  });

  const searchChange = (e: any) => {
    setSearch(e.target.value);
  };

  const applySearch = (e: any) => {
    e.preventDefault();
    setKeyword(search);
    refetchMovieByKeyword();
  };

  if (isFetchingDiscoverMovie || isFetchingMovieByKeyword) {
    return <Loading />;
  }

  const indexOfLastMovie = currentPage * moviePerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviePerPage;
  const currentMovie =
    keyword != ""
      ? dataMovieByKeyword.results.slice(indexOfFirstMovie, indexOfLastMovie)
      : dataDiscoverMovie.results.slice(indexOfFirstMovie, indexOfLastMovie);

  const movieTotal =
    keyword != ""
      ? dataMovieByKeyword.results.length
      : dataDiscoverMovie.results.length;

  const pageNumber = [];
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  for (let i = 1; i <= Math.ceil(movieTotal / moviePerPage); i++) {
    pageNumber.push(i);
  }

  return (
    <Layout title="Movie | Home">
      <div className="home">
        <h1 className="title">Search Movie</h1>
        <form className="search-section" onSubmit={applySearch}>
          <Input name="search" value={search} onChange={searchChange} />
          <button type="submit" className="pagination-button">
            Search
          </button>
        </form>
      </div>
      <div className="container">
        <div className="pagination">
          {pageNumber.map((number) => (
            <Pagination
              currentPage={currentPage}
              number={number}
              onClick={() => paginate(number)}
            />
          ))}
        </div>
        <div className="movie">
          {keyword == ""
            ? currentMovie.map((movie: any) => (
                <Card key={movie.id}>
                  <img
                    src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    className="movie-image"
                  />
                  <div className="movie-title">
                    <h4>{movie.original_title}</h4>
                    <p className="release-date">{movie.release_date}</p>
                  </div>
                </Card>
              ))
            : dataMovieByKeyword.results.map((movie: any) => (
                <Card key={movie.id}>
                  <img
                    src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    className="movie-image"
                  />
                  <div className="movie-title">
                    <h4>{movie.original_title}</h4>
                    <p className="release-date">{movie.release_date}</p>
                  </div>
                </Card>
              ))}
        </div>
      </div>
    </Layout>
  );
}
