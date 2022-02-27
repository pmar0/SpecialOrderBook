import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateOrder = (props) => {
    const navigate = useNavigate();
    let windowScrollTimeout;
    const customerInfoDetail = useRef();
    const productInfoDetail = useRef();
    const extraDetail = useRef();
    const firstNameInput = useRef();
    const productDescriptionInput = useRef();
    const notesInput = useRef();
    const initialsInput = useRef();
    const createOrderForm = useRef();
    const emptyOrder = {
        productDescription:"",
        productBrand:"",
        productUPC:"",
        firstName:"",
        lastName:"",
        keytag:"",
        homePhone:"",
        cellPhone:"",
        customerAltName:"",
        customerAltPhoneNumber:"",
        category:"",
        orderQuantity:"",
        createdBy:"",
        notes:""
    }
    const [order, setOrder] = useState(emptyOrder)
    const [errors, setErrors] = useState(emptyOrder)
    const [firstErrLoad, setFirstErrLoad] = useState(false)

    useEffect(() =>{
        if(!productInfoDetail.current.open && !extraDetail.current.open){
            customerInfoDetail.current.open = true;
            firstNameInput.current.focus();
            window.scrollTo(0,44);
        }
        // windowScroll(500);
        //eslint-disable-next-line
    },[])

    useEffect(() =>{ //need to figure out pulling those else if's out of the firstErrLoad so the red will get removed properly
        if(firstErrLoad){
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            //                               CustomerInfo Block                                              //
            ///////////////////////////////////////////////////////////////////////////////////////////////////
            if(errors.firstName || errors.lastName || errors.keytag || errors.homePhone || errors.cellPhone || errors.customerAltName || errors.customerAltPhoneNumber){
                if(!productInfoDetail.current.open && !extraDetail.current.open && !customerInfoDetail.current.open){
                    if(!customerInfoDetail.current.className.includes("text-red-500")) {
                        customerInfoDetail.current.classList.toggle("text-red-500")
                    }
                    customerInfoDetail.current.open = true;
                    firstNameInput.current.focus();
                    // windowScroll(200);
                }
            }
            else if(customerInfoDetail.current.className.includes("text-red-500")){
                // customerInfoDetail.current.className = customerInfoDetail.current.className.split(" text-red-500")[0]
                customerInfoDetail.current.classList.toggle("text-red-500")
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            //                               ProductInfo Block                                               //
            ///////////////////////////////////////////////////////////////////////////////////////////////////
            if(errors.productDescription || errors.productBrand || errors.productUPC || errors.orderQuantity || errors.category){
                if(!productInfoDetail.current.className.includes("text-red-500")) {
                    productInfoDetail.current.classList.toggle("text-red-500")
                }
                if(!customerInfoDetail.current.open && !productInfoDetail.current.open){
                    productInfoDetail.current.open = true;
                    productDescriptionInput.current.focus();
                    // windowScroll(200);
                }
            }
            else if(productInfoDetail.current.className.includes("text-red-500")){
                // productInfoDetail.current.className = productInfoDetail.current.className.split(" text-red-500")[0]
                productInfoDetail.current.classList.toggle("text-red-500")
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            //                               extraDetail Block                                               //
            ///////////////////////////////////////////////////////////////////////////////////////////////////
            if(errors.notes){
                if(!extraDetail.current.className.includes("text-red-500")) {
                    extraDetail.current.classList.toggle("text-red-500")
                }
                if((!customerInfoDetail.current.open || !productInfoDetail.current.open) &&  !extraDetail.current.open){
                    extraDetail.current.open = true;
                    notesInput.current.focus();
                    // windowScroll(200);
                }
            }
            else if(extraDetail.current.className.includes("text-red-500")){
                // extraDetail.current.className = extraDetail.current.className.split(" text-red-500")[0]
                extraDetail.current.classList.toggle("text-red-500")
            }
            setFirstErrLoad(false)
        }
        //eslint-disable-next-line
    },[errors])

    const handleChange = (e) =>{
        setOrder({
            ...order,
            [e.target.name]:e.target.value
        })
        setErrors({
            ...errors,
            [e.target.name]:""
        })
    }

    const createOrder = (e) =>{
        e.preventDefault();

        closeAll();
        
        axios.post('http://localhost:8000/api/special_order/',order,{withCredentials:true})
        .then((res) =>{
            setOrder(emptyOrder)
            setErrors(emptyOrder)
            // console.log(res.data)
            clearTimeout(windowScrollTimeout)
            navigate('/dashboard')
        })
        .catch((err) =>{
            console.log(err.response)
            setFirstErrLoad(true)
            setErrors({
                ...errors,
                ...err.response.data.error.errors
            })
        })
    }

    const openAnimation = (e) =>{
        if(e.keyCode===9 && !e.shiftKey){
            e.preventDefault();
            if(extraDetail.current.open){
                customerInfoDetail.current.open = false;
                productInfoDetail.current.open = false;
                extraDetail.current.open = false;
                initialsInput.current.focus();
            }
            else if(productInfoDetail.current.open){
                customerInfoDetail.current.open = false;
                productInfoDetail.current.open = false;
                extraDetail.current.open = true;
                notesInput.current.focus();
            }
            else if(customerInfoDetail.current.open){
                customerInfoDetail.current.open = false;
                productInfoDetail.current.open = true;
                productDescriptionInput.current.focus();
            }
            // windowScroll(500);
        }
    }

    const switchSection = (e) =>{
        if(e.keyCode===13){
            if(extraDetail.current.open){
                e.preventDefault();
                closeAll();
                initialsInput.current.focus();
            }
            else if(productInfoDetail.current.open){
                e.preventDefault();
                customerInfoDetail.current.open = false;
                productInfoDetail.current.open = false;
                extraDetail.current.open = true;
                notesInput.current.focus();
            }
            else if(customerInfoDetail.current.open){
                e.preventDefault();
                customerInfoDetail.current.open = false;
                productInfoDetail.current.open = true;
                productDescriptionInput.current.focus();
            }
            // windowScroll(500);
        }
    }

    const closeOthers = (e) =>{
        e.preventDefault();
        
        if(e.target.id === "customerInfoDetail"){
            customerInfoDetail.current.open = !customerInfoDetail.current.open;
            productInfoDetail.current.open = false;
            extraDetail.current.open = false;
            firstNameInput.current.focus();
        }
        else if(e.target.id === "productInfoDetail"){
            productInfoDetail.current.open = !productInfoDetail.current.open;
            customerInfoDetail.current.open = false;
            extraDetail.current.open = false;
            productDescriptionInput.current.focus();
        }
        else if(e.target.id === "extraDetail"){
            extraDetail.current.open = !extraDetail.current.open;
            customerInfoDetail.current.open = false;
            productInfoDetail.current.open = false;
            notesInput.current.focus();
        }
        if(!customerInfoDetail.current.open && !productInfoDetail.current.open && !extraDetail.current.open){
            initialsInput.current.focus();
        }
        // windowScroll(500);
    }

    const closeAll = () =>{
        customerInfoDetail.current.open = false;
        productInfoDetail.current.open = false;
        extraDetail.current.open = false;
    }
    
    const windowScroll = (pause) =>{
        console.log('noo bad scroll');
        windowScrollTimeout = setTimeout(() =>{
            createOrderForm.current.scrollIntoView({
                behavior:'smooth',
                block:'end'
            });
        }, pause);
    }

    const scroll = (e) =>{
        console.log('in scroll')
        if(e.target.open){
            createOrderForm.current.scrollIntoView({
                behavior:'auto',
                block:'end'
            });
            console.log('actually triggered scroll', window.scrollY)
        }
    }
    
    const preventScroll = (e) =>{
        e.target.value = 0;
    }

    return(
        <div className='formContainer'>
            <form ref={createOrderForm} onKeyDownCapture={switchSection} onSubmit={createOrder} className="shadow-md rounded-2xl mx-auto mt-20 mb-20 w-1/2 p-6 flex-col text-center">
                <h3 className="mx-auto font-bold text-4xl">Create Order</h3>
                <details ref={customerInfoDetail} onTransitionEndCapture={scroll} className="text-left mt-5 ml-4">
                    <summary id="customerInfoDetail" onClick={closeOthers} className="font-bold text-2xl text-left">Customer Info</summary>
                    <div className="details-div">
                        <input ref={firstNameInput} onChange={handleChange} name="firstName" value={order.firstName} className="w-4/6 p-2 rounded-md border-2" placeholder="First Name" type="text" />
                        {
                            errors.firstName?
                                <p className="m-0 alertBadLeft">{errors.firstName.message}</p>
                            :null
                        }
                        <input onChange={handleChange} name="lastName" value={order.lastName} className="w-4/6 p-2 rounded-md border-2" placeholder="Last Name" type="text" />
                        {
                            errors.lastName?
                                <p className="m-0 alertBadLeft">{errors.lastName.message}</p>
                            :null
                        }
                        <input onChange={handleChange} name="keytag" value={order.keytag} className="w-4/6 p-2 rounded-md border-2" placeholder="Keytag eg. 1234" type="text" />
                        {
                            errors.keytag?
                                <p className="m-0 alertBadLeft">{errors.keytag.message}</p>
                            :null
                        }
                        <input onChange={handleChange} name="homePhone" value={order.homePhone} className="w-4/6 p-2 rounded-md border-2" placeholder="Home Phone" type="tel" />
                        {
                            errors.homePhone?
                                <p className="m-0 alertBadLeft">{errors.homePhone.message}</p>
                            :null
                        }
                        <input onChange={handleChange} name="cellPhone" value={order.cellPhone} className="w-4/6 p-2 rounded-md border-2" placeholder="Cell Phone" type="tel" />
                        {
                            errors.cellPhone?
                                <p className="m-0 alertBadLeft">{errors.cellPhone.message}</p>
                            :null
                        }
                        <input onChange={handleChange} name="customerAltName" value={order.customerAltName} className="w-4/6 p-2 rounded-md border-2" placeholder="Alt Name" type="text" />
                        {
                            errors.customerAltName?
                                <p className="m-0 alertBadLeft">{errors.customerAltName.message}</p>
                            :null
                        }
                        <input onKeyDownCapture={openAnimation} onChange={handleChange} name="customerAltPhoneNumber" value={order.customerAltPhoneNumber} className="w-4/6 p-2 rounded-md border-2" placeholder="Alt Phone Number" type="tel" />
                        {
                            errors.customerAltPhoneNumber?
                                <p className="m-0 alertBadLeft">{errors.customerAltPhoneNumber.message}</p>
                            :null
                        }
                    </div>
                </details>

                <details ref={productInfoDetail} className="text-left mt-3 ml-4">
                    <summary id="productInfoDetail" onClick={closeOthers} className="font-bold text-2xl text-left">Product Info</summary>
                    <div className="details-div">
                        <input ref={productDescriptionInput} onChange={handleChange} name="productDescription" value={order.productDescription} className="w-4/6 p-2 rounded-md border-2" placeholder="Description" type="text" />
                        {
                            errors.productDescription?
                                <p className="m-0 alertBadLeft">{errors.productDescription.message}</p>
                            :null
                        }
                        <input onChange={handleChange} name="productBrand" value={order.productBrand} className="w-4/6 p-2 rounded-md border-2" placeholder="Brand" type="text" />
                        {
                            errors.productBrand?
                                <p className="m-0 alertBadLeft">{errors.productBrand.message}</p>
                            :null
                        }
                        <input onChange={handleChange} name="productUPC" value={order.productUPC} className="w-4/6 p-2 rounded-md border-2" placeholder="UPC" type="text" />
                        {
                            errors.productUPC?
                                <p className="m-0 alertBadLeft">{errors.productUPC.message}</p>
                            :null
                        }
                        <div>
                            <input onChange={handleChange} onWheel={preventScroll} name="orderQuantity" value={order.orderQuantity} className="w-1/12 p-2 rounded-md border-2" placeholder="QTY" type="number" min="0" />
                            <span className="ml-2 text-2xl font-bold">PC</span>
                            {
                            errors.orderQuantity?
                                <p className="mt-3 mb-0 alertBadLeft">{errors.orderQuantity.message}</p>
                            :null
                            }
                        </div>
                        <select onKeyDownCapture={openAnimation} className="w-4/6 p-2 rounded-md border-2" onChange={handleChange} name="category" value={order.category}>
                            <option defaultValue disabled value="">--Category--</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Supplements">Supplements</option>
                            <option value="Health and Beauty">Health and Beauty</option>
                            <option value="Professional Supplements">Professional Supplements</option>
                            <option value="Produce">Produce</option>
                            <option value="Other">Other</option>
                        </select>
                        {
                            errors.category?
                                <p className="m-0 alertBadLeft">{errors.category.message}</p>
                            :null
                        }
                    </div>
                </details>

                <details ref={extraDetail} className="text-left mt-3 ml-4">
                    <summary id="extraDetail" onClick={closeOthers} className="font-bold text-2xl text-left">Extra</summary>
                    <div className="details-div">
                        <textarea ref={notesInput} onKeyDownCapture={openAnimation} onChange={handleChange} value={order.notes} className="w-4/6 p-2 rounded-md border-2"name="notes" placeholder="Order notes" cols="30" rows="3"></textarea>
                        {
                            errors.notes?
                                <p className="m-0 alertBadLeft">{errors.notes.message}</p>
                            :null
                        }
                    </div>
                </details>
                
                <input ref={initialsInput} onFocus={closeAll} onChange={handleChange} name="createdBy" value={order.createdBy} className="w-16 p-2 mt-5 rounded-md border-2" placeholder="Initial" type="text" />
                {
                    errors.createdBy?
                        <p className="m-2 alertBad">{errors.createdBy.message}</p>
                    :null
                }
                <button className="btn-primary btn-shadow block mx-auto mt-4 p-2 rounded-lg w-2/6 text-lg">Create Order</button>
            </form>
        </div>
    );
};

export default CreateOrder;