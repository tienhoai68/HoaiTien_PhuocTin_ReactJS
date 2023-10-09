import React, { useContext, useEffect, useState } from "react";
import { filmService } from "../../services/Films";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "./AdminFilm.scss";
import { LoadingContext } from "../../contexts/Loading/Loading";

export default function AdminFilm() {
  const navigate = useNavigate();
  const [filmList, setFilmList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const fistIndex = lastIndex - recordsPerPage;
  const records = filmList.slice(fistIndex, lastIndex);
  const npage = Math.ceil(filmList.length / recordsPerPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  const [_, setIsLoading] = useContext(LoadingContext);

  useEffect(() => {
    fetchFilmList();
  }, []);

  const fetchFilmList = async () => {
    document.getElementById("loader").style.display = "none";
    setIsLoading({ isLoading: true });
    const result = await filmService.fetchFilmsListApi();
    if (result.data.content) {
      setFilmList(result.data.content);
      setIsLoading({ isLoading: false });
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmationResult = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (confirmationResult.isConfirmed) {
        const result = await filmService.fetchFilmDeleteApi(id);
        if (result.data.content) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          fetchFilmList();
        } else {
          Swal.fire('error');
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.response.data.content}`,
      })
    }
  };

  const handleSearch = async (event) => {
    if (event.target.value !== "") {
      const result = await filmService.fetchFilmSearchApi(event.target.value);

      setFilmList(result.data.content);
    } else {
      fetchFilmList();
    }
  };
  const renderFilm = () => {
    return records.map((element, idx) => {
      return (
        <tr key={idx}>
          <td>{element.maPhim}</td>
          <td>
            {" "}
            <img className="img-admin" width={100} height={100} src={element.hinhAnh} alt="" />
          </td>
          <td>{element.tenPhim}</td>
          <td>
            {element.moTa.length > 50
              ? element.moTa.substr(0, 50) + "..."
              : element.moTa}
          </td>
          <td className="listAction">
            <button
              onClick={() => navigate(`/admin/films/edit/${element.maPhim}`)}
              className="mr-2 btnAction1"
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </button>
            <button
              className="mr-2 btnAction2"
              onClick={() => handleDelete(element.maPhim)}
            >
              <i className="fa-solid fa-trash" />
            </button>
            <button
              className="mr-2 btnAction3"
              onClick={() =>
                navigate(`/admin/films/showtime/${element.maPhim}`)
              }
            >
              <i className="fa-solid fa-calendar-days" />
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <h1>Quản lý phim</h1>
      <button
        className="btn btn-info mb-3"
        onClick={() => navigate(`/admin/films/addnew`)}
      >
        Thêm phim
      </button>
      <div className="row mb-3">
        <div className="col">
          <div className="input-group">
            <input
              type="text"
              onChange={handleSearch}
              className="form-control"
              placeholder="Tìm kiếm theo tên phim"
            />
            <div className="input-group-prepend">
              <span className="input-group-text" id="btnTimNV">
                <i className="fa fa-search" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="spinner-border adminloading" id="loader" />
      <table className="table">
        <thead>
          <th>Mã phim</th>
          <th>Hình ảnh </th>
          <th>Tên phim</th>
          <th>Mô tả</th>
          <th>Hành động</th>
        </thead>

        <tbody>{renderFilm()}</tbody>
      </table>
      <nav>
        <ul className="pagination">
          <li className="page-item">
            <a href="#" className="page-link" onClick={prePage}>
              Prev
            </a>
          </li>
          {number.map((n, i) => (
            <li
              className={`page-item ${currentPage === n ? "active" : ""}`}
              key={i}
            >
              <a href="#" className="page-link" onClick={() => changeCPage(n)}>
                {n}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a href="#" className="page-link" onClick={nextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );

  function prePage() {
    if (currentPage !== fistIndex) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== fistIndex) {
      setCurrentPage(currentPage + 1);
    }
  }
}
