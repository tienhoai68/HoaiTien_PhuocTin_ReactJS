import React, { useState } from "react";
import { DatePicker, Form, Input, InputNumber, Radio, Switch } from "antd";
import moment from "moment";
import { filmService } from "../../services/Films";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function AddFilm() {
  const navigate = useNavigate();
  const [componentSize, setComponentSize] = useState("default");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const [img, setImg] = useState("");

  const [state, setState] = useState({
    maNhom: "GP01",
    tenPhim: "",
    trailer: "",
    moTa: "",
    ngayKhoiChieu: "",
    dangChieu: false,
    sapChieu: false,
    hot: false,
    danhGia: 0,
    hinhAnh: {},
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  const handleChangeSwitch = (value, name) => {
    setState({
      ...state,
      [name.target.offsetParent.name]: value,
    });
  };
  const handleChangeDate = (value) => {
    const ngayKhoiChieu = moment(value).format("DD/MM/YYYY");
    setState({
      ...state,
      ngayKhoiChieu: ngayKhoiChieu,
    });
  };
  const handleChangeNumber = (value) => {
    setState({
      ...state,
      danhGia: value,
    });
  };

  const handleChangeImg = (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setImg(event.target.result);
    };
    setState({
      ...state,
      hinhAnh: file,
    });
  };
  const handleSubmit = async () => {
    let formData = new FormData();
    for (let name in state) {
      if (name !== "hinhAnh") {
        formData.append(name, state[name]);
      } else {
        formData.append("File", state.hinhAnh, state.hinhAnh.name);
      }
    }
    try {
      const result = await filmService.fetchAddNewFilmApi(formData);
      if (result.data.content) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Bạn đã thêm phim thành công',
        });
        navigate("/admin/films");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.response.data.content}`,
      })
    }

  };

  return (
    <div>
      <h1 className="md-5">Thêm phim</h1>
      <Form
        onSubmitCapture={handleSubmit}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item label="Form Size" name="size">
          <Radio.Group>
            <Radio.Button value="small">Small</Radio.Button>
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="large">Large</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Tên Phim">
          <Input name="tenPhim" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Trailer">
          <Input name="trailer" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Mô Tả">
          <Input name="moTa" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Date">
          <DatePicker
            format="DD/MM/YYYY"
            name="ngayKhoiChieu"
            onChange={handleChangeDate}
          />
        </Form.Item>
        <Form.Item label="Đang Chiếu" valuePropName="checked">
          <Switch name="dangChieu" onChange={handleChangeSwitch} />
        </Form.Item>
        <Form.Item label="Sắp Chiếu" valuePropName="checked">
          <Switch name="sapChieu" onChange={handleChangeSwitch} />
        </Form.Item>
        <Form.Item label="Hot" valuePropName="checked">
          <Switch name="hot" onChange={handleChangeSwitch} />
        </Form.Item>
        <Form.Item label="Đánh Giá">
          <InputNumber
            onChange={handleChangeNumber}
            name="danhGia"
            min={1}
            max={10}
          />
        </Form.Item>
        <Form.Item label="Hình Ảnh">
          <input name="hinhAnh" type="File" onChange={handleChangeImg} />
          <br />
          <img style={{ width: 150, height: 150 }} src={img} alt="..." />
        </Form.Item>
        <Form.Item label="Tác Vụ">
          <button className="p-2 btn btn-success" type="submit">
            Thêm Phim
          </button>
        </Form.Item>
      </Form>
    </div>
  );
}
