import { Button, Col, Row } from "react-bootstrap";
import React, { useEffect} from "react";
import "./groupProduct.css";
import GroupModalProduct from "./modalGroupProduct";
import { useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import allStore from "../../../store/actions";
import { useParams } from "react-router-dom";


const GroupProduct =() =>{
    const [modalShow, setModalShow] = React.useState(false);
    const dispatch = useDispatch();
    const {id} = useParams()
    const groupProduct = useSelector(({groupProduct}) => groupProduct)
    
    useEffect(() =>{
        dispatch(allStore.fetchGroupProduct(id))
    },[dispatch , id])

    return(
        <>
        <div className="groupProductContainer">
            <div className="groupContent">
                <div className="titleProduct">
                    <Row >
                        <Col className="text-end"><h3>Subscribe Group</h3> </Col>
                        <Col className="text-end"> <Button style={{marginRight:"20px"}} variant="success">Create New Group</Button></Col>
                    </Row>
                    </div>
                <div className="fieldProduct d-flex flex-wrap justify-content-beetwen">

                    {groupProduct.map((el, i) => (
                            
                    <div className="CardGroup mx-1 my-2" key={i}>
                        <Row>
                            <Col>
                            <img src={el.Url} alt="img" width="80px" style={{marginLeft:"-10px"}}/>
                            </Col>
                            <Col>
                            <div className="rounded-pill statusAvaliable">avaliable</div>
                            </Col>
                        </Row>
                        <h5 style={{textAlign:"center"}}>Group {el.ID}</h5>
                        <hr style={{width:"200px" , margin:"0 auto", marginBottom:"10px"}}/>
                            <ul>
                                <li className="listuser">produk id {el.ProductsID}</li>
                                <li className="listuser">AAAAA</li>
                                <li className="listuser">AAAAA</li>
                                <li className="listuser">AAAAA</li>
                            </ul>
                        <div className="ButtonOrder">
                        <Button variant="success" className="mt-1" style={{width:"100px",}}onClick={() => setModalShow(true)}>Order</Button>
                        <GroupModalProduct
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        />
                        </div>
                    </div>
                    ))}
                    
                    {/* <div className="CardGroup mx-1 my-2">
                        <Row>
                            <Col>
                            <img src="https://www.freepnglogos.com/uploads/netflix-logo-circle-png-5.png" alt="img" width="80px" style={{marginLeft:"-10px"}}/>
                            </Col>
                            <Col>
                            <div className="rounded-pill statusFull">full</div>
                            </Col>
                        </Row>
                        <h5 style={{textAlign:"center"}}>Group 11111</h5>
                        <hr style={{width:"200px" , margin:"0 auto", marginBottom:"10px"}}/>
                            <ul>
                                <li className="listuser">AAAAA</li>
                                <li className="listuser">AAAAA</li>
                                <li className="listuser">AAAAA</li>
                                <li className="listuser">AAAAA</li>
                            </ul>
                        <div className="ButtonOrder">
                        <Button variant="success" className="mt-1" style={{width:"100px",}} disabled>Order</Button>
                        </div>
                    </div> */}
                    
                   
                    
                   
           

                </div>
            </div>
        </div>
        </>
    )
}

export default GroupProduct