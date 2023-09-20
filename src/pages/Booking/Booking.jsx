import React, { useEffect, useState } from 'react'
import "./Booking.scss"
import { useParams } from 'react-router-dom'
import { ticketService } from '../../services/ticket';

export default function Booking() {
  const params = useParams();

  const [ticketDetail, setTicketDetail] = useState({});
  const [chairList, setChairList] = useState([]);

  useEffect(() => {
    fetchTicketDetail();
  }, []);

  const fetchTicketDetail = async () => {
    const result = await ticketService.fetchTicketDetailApi(params.bookingId);
    console.log(result);
    setTicketDetail(result.data.content.thongTinPhim);
    setChairList(result.data.content.danhSachGhe.map((element) => {
      return {
        ...element,
        dangChon: false,
      }
    }));
  }

  const renderChairList = () => {
    return chairList.map((element, index) => {
      return (
        <React.Fragment key={element.maGhe}>
          <button className="mr-1 mb-1 chair btn">{element.tenGhe}</button>
          {(index + 1) % 16 === 0 && <br />}
        </React.Fragment>
      )
    })
  }


  return (
    <div className="backgroud-booking ">
      <div className='row mr-0 ml-0'>
        <div className='col-8'>
          <div className="title">MOVIE SEAT SELECTION</div>
          <div className=''>
            <div className='wrapper-booking'>
              <div className="w-100">
                <div className="screen">
                  <h2 className="wthree">Screen this way</h2>
                </div>
                <div className="mt-5">
                  <ul className="seat_w3ls text-center">
                    <li className="smallBox greenBox">Selected Seat</li>
                    <li className="smallBox redBox">Reserved Seat</li>
                    <li className="smallBox emptyBox">Empty Seat</li>
                  </ul>
                </div>
              </div>
              <div style={{ width: "100" }} className="mx-auto text-center">
                {renderChairList()}
              </div>
            </div>
          </div>
        </div>
        <div className='col-4 mt-5'>
          <div className="movie-info">
            <div className="movie-price">
              <p className="price-text">0VND</p>
            </div>
            <hr className="divider" />
            <div className="movie-details">
              <h3 className="detail-heading">Cụm Rạp:</h3>
              <h3 className="detail-value">{ticketDetail.tenCumRap}</h3>
            </div>
            <hr className="divider" />
            <div className="movie-details">
              <h3 className="detail-heading">Địa chỉ:</h3>
              <h3 className="detail-value">{ticketDetail.diaChi}</h3>
            </div>
            <hr className="divider" />
            <div className="movie-details">
              <h3 className="detail-heading">Rạp:</h3>
              <h3 className="detail-value">{ticketDetail.tenRap}</h3>
            </div>
            <hr className="divider" />
            <div className="movie-details">
              <h3 className="detail-heading">Ngày giờ chiếu:</h3>
              <h3 className="detail-value">{ticketDetail.ngayChieu} - <span className="time-highlight">{ticketDetail.gioChieu}</span></h3>
            </div>
            <hr className="divider" />
            <div className="movie-details">
              <h3 className="detail-heading">Tên Phim:</h3>
              <h3 className="detail-value">{ticketDetail.tenPhim}</h3>
            </div>
            <hr className="divider" />
            <div className="movie-details">
              <h3 className="detail-heading">Chọn: </h3>
              <h3 className="detail-value"></h3>
            </div>
            <hr className="divider" />
            <div className="button-group">
              <button className="button_default btn_booking ">Đặt vé</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}