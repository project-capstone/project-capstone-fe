import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import swal from "sweetalert";
import axios from "axios";
import {
  Button,
  InputGroup,
  Form,
  Image,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import "./addProduct.css";

const AddProduct = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const goToHome = () => {
    navigate(`/`);
  };

  const { name_product, detail_product, price, limit, photo } = form;

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (field, value) => {
    if (!field || field === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(value);
  };

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
    else if (limit <= 1) newErrors.limit = "limit cannot be less than 2";
    // else if (limit >= 10) newErrors.limit = "limit cannot be more than 9";
    // photo errors
    if (!photo || photo === "") {
      newErrors.photo = "cannot be blank!";
      setSelectedFile(undefined);
    } else if (photo.size > 1e6) {
      newErrors.photo = "Photo size cannot be more than 1 MB!";
      setSelectedFile(undefined);
    }

    return newErrors;
  };

  const handleAdd = (e) => {
    e.preventDefault();

    // Errors Check
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setLoading(true);

      let prices = parseInt(price);
      let limits = parseInt(limit);

      const data = new FormData();
      data.append("name_product", name_product);
      data.append("detail_product", detail_product);
      data.append("price", prices);
      data.append("limit", limits);
      data.append("photo", photo);

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

  if (loading) {
    console.log("INI LAGI LOADING!");
    return (
      <div className="LoadingContainer">
        <div className="loadingCenter">
          <h3>
            {" "}
            <Spinner animation="grow" variant="success" /> Loading ...{" "}
          </h3>
        </div>
      </div>
    );
  } else if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  } else {
    return (
      <>
        <div className="BaseContainer">
          <div className="title text-center">
            <h3 style={{ color: "#0c6632" }}>Add New Product</h3>
          </div>
          <div className="newProduct mt-5">
            {/* Product Name */}
            <Row className="mb-3">
              <Form.Group as={Col} md="12">
                <Form.Label>
                  Product Name<sup>*</sup>
                </Form.Label>
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
              </Form.Group>
            </Row>

            {/* Detail Product */}
            <Row className="mb-3">
              <div className="col-12">
                <Form.Label>
                  Detail Product<sup>*</sup>
                </Form.Label>
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
              </div>
            </Row>

            <Row className="mb-3">
              {/* Limit */}
              <div className="col-12">
                <Form.Label>
                  Capacity Product<sup>*</sup>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Capacity"
                  onChange={(e) => setField("limit", e.target.value.trim())}
                  required
                  isInvalid={!!errors.limit}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.limit}
                </Form.Control.Feedback>
              </div>
            </Row>

            <Row className="mb-3">
              {/* Price */}
              <Col md={12}>
                <Form.Label>
                  Price<sup>*</sup>
                </Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">Rp. </InputGroup.Text>
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
                </InputGroup>
              </Col>
            </Row>

            {/* Upload File */}
            <Row>
              <div className="preview d-flex justify-content-center align-items-center">
                {selectedFile && (
                  <Image
                    rounded
                    src={preview}
                    alt="preview product"
                    style={{
                      width: 500,
                      height: 300,
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>

              <Form.Group controlId="photo " className="mb-3">
                <Form.Label>
                  Product Picture<sup>*</sup>
                </Form.Label>
                <Form.Control
                  type="file"
                  placeholder=""
                  accept="image/png, image/jpg, image/jpeg, image/bnp"
                  onChange={(e) => {
                    setField("photo", e.target.files[0]);
                    onSelectFile(setSelectedFile, e.target.files[0]);
                  }}
                  required
                  isInvalid={!!errors.photo}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.photo}
                </Form.Control.Feedback>
                <h7>file type: jpg/jpeg/png and max size: 1 MB</h7>
              </Form.Group>
            </Row>

            <Row className="d-flex mb-3">
              <h6>
                <sup>* Required</sup>
              </h6>
            </Row>

            <Row className="d-flex align-items-center justify-content-center">
              <Button
                onClick={handleAdd}
                className="confirm mt-3 col-6"
                size="lg"
                width="100%"
                variant="success"
              >
                Add Product
              </Button>
            </Row>
          </div>
        </div>
      </>
    );
  }
};

export default AddProduct;
