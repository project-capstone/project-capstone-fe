import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import axios from "axios";
import {
  Button,
  InputGroup,
  Form,
  FloatingLabel,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import "./editProduct.css";

const EditProduct = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  const navigate = useNavigate();
  const params = useParams();

  const goToHome = () => {
    navigate(`/`);
  };

  const [product, setProduct] = useState({});
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://barengin.site/products/${params.id}`)
      .then(({ data }) => {
        // console.log(data.data);
        setProduct(data.Data);
        console.log(product);
      })
      .catch((err) => {
        console.log(err.data.Message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const { name_product, detail_product, price, limit, photo } = form;

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
    // Check and see if errors exist, and remove them from the error object:
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const findFormErrors = () => {
    const newErrors = {};
    // name_product errors
    if (!name_product || name_product === "")
      newErrors.name_product = "cannot be blank!";
    // detail_product errors
    if (!detail_product || detail_product === "")
      newErrors.detail_product = "cannot be blank!";
    // price errors
    if (!price || price === "") newErrors.price = "cannot be blank!";
    // limit errors
    if (!limit || limit === "") newErrors.limit = "cannot be blank!";
    // photo errors
    if (!photo || photo === "") newErrors.photo = "cannot be blank!";
    return newErrors;
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    // Conditional logic:
    if (Object.keys(newErrors).length > 0) {
      // We got errors!
      setErrors(newErrors);
    } else {
      setLoading(true);

      let prices = parseInt(price);
      let limits = parseInt(limit);

      const data = new FormData();
      data.append("name_product ", name_product);
      data.append("detail_product ", detail_product);
      data.append("price ", prices);
      data.append("limit ", limits);
      data.append("photo ", photo);

      for (var pair of data.entries()) {
        console.log(pair[0] + " = " + pair[1]);
      }

      console.log(data);
      console.log(name_product);
      console.log(detail_product);
      console.log(prices);
      console.log(limits);
      console.log(photo);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      axios
        .post("https://barengin.site/jwt/products", data, config)
        .then((response) => {
          swal({
            text: response.data.Message,
            icon: "success",
          });

          goToHome();
        })
        .catch((err) => {
          if (err) {
            swal({
              text: err.response.data.Message,
              icon: "error",
            });
          } else {
            swal.stopLoading();
            swal.close();
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <div className="BaseContainer">
        <div className="title text-center">
          <h3 style={{ color: "#0c6632" }}>Edit Product</h3>
        </div>
        <div className="editProduct mt-5">
          {/* Product Name */}
          <Row>
            <Col md={12}>
              <FloatingLabel
                controlId="floatingProductName"
                label="Product Name"
              >
                <Form.Control
                  type="text"
                  placeholder="Product Name"
                  onChange={(e) =>
                    setField("name_product", e.target.value.trim())
                  }
                  required
                  isInvalid={!!errors.name_product}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name_product}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>
          </Row>

          {/* Detail Product */}
          <Row>
            <div className="col-12">
              <FloatingLabel
                controlId="floatingInput"
                label="Detail Product"
                className="mb-3 mt-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Detail Product"
                  style={{ height: "150px" }}
                  onChange={(e) =>
                    setField("detail_product", e.target.value.trim())
                  }
                  required
                  isInvalid={!!errors.detail_product}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.detail_product}
                </Form.Control.Feedback>
              </FloatingLabel>
            </div>
          </Row>

          <Row>
            {/* Limit */}
            <div className="col-12">
              <FloatingLabel controlId="floatingLimit" label="Limit">
                <Form.Control
                  type="number"
                  placeholder="Limit"
                  onChange={(e) => setField("limit", e.target.value.trim())}
                  required
                  isInvalid={!!errors.limit}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.limit}
                </Form.Control.Feedback>
              </FloatingLabel>
            </div>
          </Row>

          <Row className="d-flex">
            {/* Price */}
            <Col md={12}>
              <InputGroup hasValidation className="mb-3 mt-3">
                <InputGroup.Text id="inputGroupPrepend">Rp. </InputGroup.Text>
                {/* <FloatingLabel controlId="floatingLimit" label="Price"> */}
                <Form.Control
                  type="number"
                  placeholder="Price"
                  onChange={(e) => setField("price", e.target.value.trim())}
                  required
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
                {/* </FloatingLabel> */}
              </InputGroup>
            </Col>
          </Row>

          {/* Upload File */}
          <Row>
            <Form.Group controlId="photo " className="mb-3">
              <Form.Label>Product Picture</Form.Label>
              <Form.Control
                type="file"
                placeholder=""
                accept="image/png, image/jpg, image/jpeg, image/bnp"
                onChange={(e) => {
                  setField("photo", e.target.files[0]);
                }}
                required
                isInvalid={!!errors.photo}
              />
              <Form.Control.Feedback type="invalid">
                {errors.photo}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="d-flex align-items-center justify-content-center">
            <Button
              onClick={handleEdit}
              className="confirm mt-3 col-6"
              size="lg"
              width="100%"
            >
              Save Change
            </Button>
          </Row>
        </div>
      </div>
    </>
  );
};

export default EditProduct;