import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment-timezone'

const Dashboard = (props) => {
    const [specialOrders, setSpecialOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() =>{
        axios.get("http://localhost:8000/api/special_order/",{withCredentials:true})
        .then((res) =>{
            setSpecialOrders(res.data.specialOrders)
        })
        .catch((err) =>{
            if(err.response.status === 401){
                navigate('/login',{state: {message:err.response.data.message,good:false,prevLocation:location.pathname}})
            }
            // console.log("Failed to retrieve special orders.")
        })
        //eslint-disable-next-line
    },[])

    const dateString = (date) =>{
        const realDate = moment.utc(date).tz("America/New_York")
        return realDate.format("MM-DD-YYYY")
        // new Date(realDate).toLocaleString()
    }

    const formatPhoneNumber = (phoneNumber) =>{
        var cleaned = ('' + phoneNumber).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return match[1] + '-' + match[2] + '-' + match[3];
        }
        return "None";
    }

    const selectRow = (orderId) =>{
        if(selectedOrders.includes(orderId)){
            setSelectedOrders(selectedOrders.filter((orderID,index)=>{
                return (orderID !== orderId)
            }))
        }
        else{
            setSelectedOrders([...selectedOrders,orderId])
        }
        // if(e.target.parentNode.className.includes("selected")){
        //     e.target.parentNode.className = "row"
        // }
        // else{
        //     e.target.parentNode.className += " selected"
        // }
        // console.log(e.target.parentNode.className)
    }

    const deleteFromDom = (index,orderId) =>{
        axios.delete(`http://localhost:8000/api/special_order/${orderId}`,{withCredentials:true})
        .then(res =>{
            const newOrderList = specialOrders.filter((order,i) => (
                i !== index
            ))
            setSpecialOrders(newOrderList)
        })
        .catch(err => console.log("I failed delete dashboard: ",err.response))
    }

    return(
        <div className="wrapper flex-col">
            <div className="flex">
                <button onClick={e=>{navigate("/special_order/create")}} className="btn-primary btn-shadow p-3 pr-16 pl-16 mb-2 ml-auto rounded-lg text-lg">Add</button>
            </div>
            <table className="table">
                <thead>
                    <tr className="row header blue">
                        <th colSpan="2" className="cell">Customer Info</th>
                        <th colSpan="2" className="cell">Product Info</th>
                        <th colSpan="4" className="cell">Order Info</th>
                    </tr>
                    <tr className="row header blue">
                        <th className="cell">Name</th>
                        <th className="cell">Phone Number</th>
                        <th className="cell">Description</th>
                        <th className="cell">QTY</th>
                        <th className="cell">Ordered On</th>
                        <th className="cell">Status</th>
                        <th className="cell">ETA</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        specialOrders?
                        /*maybe add brand in if exists?*/
                        /*add in alt name override?*/
                            specialOrders.map((order, index) =>(
                                <tr onDoubleClick={e=> navigate(`/special_order/view/${order._id}`)} onClick={e => selectRow(order._id)} className={selectedOrders.includes(order._id)?"row selected relative":"row relative"} key={index}>
                                    {
                                        order.customerAltName?
                                            <td className="cell">
                                                {order.customerAltName} <p className="text-sm text-gray-500 mb-2">(Alt name)</p>
                                            </td>
                                        :<td className="cell">
                                            {`${order.firstName} ${order.lastName}`}
                                        </td>
                                    }
                                    <td className="cell w-48">
                                        {formatPhoneNumber(order.cellPhone)} {order.cellPhone?<p className="text-sm text-gray-500  mb-2">(Cell)</p>:null}
                                    </td>
                                    <td className="cell w-96">
                                        {
                                            order.productBrand?
                                                `${order.productBrand} ${order.productDescription}`
                                            :order.productDescription
                                        }
                                    </td>
                                    <td className="cell">
                                        {order.orderQuantity}PC
                                    </td>
                                    <td className="cell w-48">
                                        {order.orderedDate?dateString(order.orderedDate):"Not ordered"}
                                    </td>
                                    <td className="cell w-48">
                                        {order.statuses[order.statuses.length-1]}
                                    </td>
                                    <td className="cell w-48">
                                        {order.orderInfoETADate?order.orderInfoETADate:"N/A"}
                                    </td>
                                <div className="absolute top-4 right-3">
                                    <img onClick={e=>{navigate(`/special_order/edit/${order._id}`)}} src="editPencil.png" alt="editButton" className="mb-2" />
                                    <img onClick={e=>deleteFromDom(index,order._id)} src="trashBin.png" alt="deleteButton" />
                                </div>
                                </tr>
                            ))
                        :<h2>Loading...</h2>
                    }
                    {/* <tr onClick={selectRow} className="row">
                        <td className="cell">Doug Dimmadome</td>
                        <td className="cell">1-800-dimmadome</td>
                        <td className="cell">Suit</td>
                        <td className="cell">1PC</td>
                        <td className="cell">11/27/21</td>
                        <td className="cell">Gud</td>
                        <td className="cell">11/29/21</td>
                    </tr>
                    <tr onClick={selectRow} className="row">
                        <td className="cell">Doug Dimmadome</td>
                        <td className="cell">1-800-dimmadome</td>
                        <td className="cell">Suit</td>
                        <td className="cell">1PC</td>
                        <td className="cell">11/27/21</td>
                        <td className="cell">Gud</td>
                        <td className="cell">11/29/21</td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;