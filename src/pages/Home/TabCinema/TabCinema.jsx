import React, { Fragment, useEffect, useState } from 'react'
import { Tabs } from 'antd';
import { cinemaService } from '../../../services/cinema';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
const { TabPane } = Tabs;

export default function TabCinema() {
  const [tabPosition, setTabPosition] = useState('left');
  const [cinema, setCinema] = useState([])
  useEffect(() => {
    fetchCinema();
  }, [])

  const fetchCinema = async () => {
    const result = await cinemaService.fetchCinemaApi();
    setCinema(result.data.content)
  }

  const renderTabpane = () => {
    return cinema?.map((element, index) => {
      return (
        <TabPane tab={<img src={element.logo} className='rounded-circle' />} key={index}>
          <Tabs tabPosition={tabPosition}>
            {element.lstCumRap.slice(0,5).map((element, index) => {
              // console.log(element);
              return <TabPane tab={<div className='cinema-name text-left'>
                <div>{element.tenCumRap}</div>
                <div className='address'>{element.diaChi}</div>
              </div>} key={index}>
                {element.danhSachPhim.map((element) => {
                  return <Fragment key={element.maPhim}>
                    <div className='d-flex border-list'>
                      <img className='img-movie' src={element.hinhAnh} alt="" />
                      <div className='content-movie w-100 ml-3'>
                        <h2>{element.tenPhim}</h2>
                        <div>
                        <div className='row'>
                          {element.lstLichChieuTheoPhim.slice(0,12).map((element) => {
                            return <Fragment key={element.maLichChieu}>
                              <div className='col-3'>
                              <NavLink className='date'>{moment(element.ngayChieuGioChieu).format("hh :mm A")}</NavLink>
                              </div>
                            </Fragment>
                          })}
                        </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                })}
              </TabPane>
            })}
          </Tabs>
        </TabPane>
      )
    })
  }
  return (
    <div className='container  mt-5'>
      <div className='backgroud-movie'>
        <h2>CỤM RẠP CHIẾU</h2>
      </div>
      <Tabs tabPosition={tabPosition}>
        {renderTabpane()}
      </Tabs>
    </div>
  )
}