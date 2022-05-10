import React,{useState} from 'react'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import { useDispatch, useSelector } from 'react-redux'
import {ethers} from 'ethers'
import { useLocation } from 'react-router-dom'
import useCurrency from '../../customhook/useCurreny'
import { walletconnect } from '../../redux/metaWallet'
import useSingelpost from '../../customhook/useSingelpost'
import 'bootstrap/dist/css/bootstrap.min.css';

function Chekout() {

    const [paymetn,setPayment] = useState(true)

    let initialvalues = {
        imgfile: "",
        uploadPhoto: "4" ,
        list_title: "" ,
        list_price: "",
        list_location: "",
        list_contact: "" ,
        list_details: "" ,
        limited_age: "",
        limited_condition: "",
        limited_category: "Memorabilia"
        
    }
    const [formvalues, setFormValues] = useState(initialvalues)

      // const [path,setPath] = useState()
      const location = useLocation()
      const path1 = location.pathname.split("/")[2]
      const path2 = location.pathname.split("/")[3]
      
  
      const imoodiniData = useSingelpost(path1,path2)
      // currency converter
    const {info:currency,currencysign,currencyData} = useCurrency()

    const handelChange = (e)=>{
        const {name,value} = e.target
        setFormValues({...formvalues,[name]:value})
        console.log(formvalues)
    }

     // metamask wallet connect

    //  redux
    const dispatch = useDispatch();
    const metaWallet = useSelector(state => state.wallet.walletid);
     const handelMetamask = async (e)=>{
        e.preventDefault()
            try {
                if(!window.ethereum)
                    throw new Error('metmask not found..');
                const result = await window.ethereum.request({method: 'eth_requestAccounts'})
                if (result){
                    dispatch(walletconnect(result[0]))
                    alert(result)
                }
            } catch (error) {
                console.log('error mettamask', error)
            }
        
    }

    const handelwallettransfer =  (e)=>{
        e.preventDefault()
        const transfer = async (val)=>{
            try {
                if(!window.ethereum)
                    throw new Error('metmask not found..');
                const tx = await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params:[
                        {
                            from: metaWallet,
                            to: '0xf80CCa0450F5026FE105349B2E8Fe4F5Fe1B9190',
                            value: val,
                            gasPrice: '0x09184e72a000',
                            gas: '0x2710',
                        },
                    ],
                })
                if (tx)
                    console.log(tx)
            } catch (error) {
                console.log(error)
            }
        }
        const priceToEth = ()=>{
            const eth = Number(imoodiniData.data.ad_price * currency[currencyData]).toLocaleString()
            const result  = ethers.utils.parseEther(eth)
            // console.log(result, metaWallet)
            transfer(result._hex)
        }
        priceToEth()
        

    }

    const handelSubmit = (e)=>{
        e.preventDefault()
        setPayment(!paymetn)
    }
  return (
    <div>
        <Header />
        <section className={paymetn ? "active": ''}>
            <div className="container">
                
                <div className='hero-box'>
                    
                    <div className="row">
                        <div className="col">
                            <div className='p-5'>
                                <h4>Order Summary</h4>
                                <div className='box'>
                                    <div className="row pt-5">
                                        <div className="col">
                                            <h5>Product</h5>
                                        </div>
                                        <div className="col">
                                            <h5>price</h5>
                                        </div>
                                    </div>
                                    <div className="row pt-5">
                                        <div className="col"><h5>
                                        {imoodiniData && imoodiniData.data ?imoodiniData.data.ad_title : ""}
                                            </h5></div>
                                        <div className="col">
                                            <h6>{imoodiniData ? `$ ${imoodiniData.data.ad_price}`: ''}</h6>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col">Total</div>
                                        <div className="col"> <h5>{imoodiniData ? `$ ${imoodiniData.data.ad_price}`: ''}</h5></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className='p-5'>
                                <h4 className='p-3'>Shipping Address</h4>
                            {/* form */}
                            <form id="create-item-1" acceptCharset="utf-8" onSubmit={handelSubmit}>
                            <div className="input-group">
                                    <input name="list_price" required onChange={handelChange} value={formvalues.list_price} type="text" placeholder="First Name" />
                                    <input name="list_location" onChange={handelChange} value={formvalues.list_location} type="text" placeholder="Last Name" required />
                                </div>
                                <div className="input-group">
                                    <input name="list_title" onChange={handelChange} value={formvalues.list_title} className="m-0" type="text" placeholder="Email" required />
                                </div>
                                <div className="input-group">
                                    <input name="list_title" onChange={handelChange} value={formvalues.list_title} className="m-0" type="text" placeholder="Address" required />
                                </div>
                                <div className="input-group">
                                    <input name="list_price" onChange={handelChange} value={formvalues.list_price} type="text" placeholder="City" required />
                                    <input name="list_location" onChange={handelChange} value={formvalues.list_location} type="text" placeholder="Emirate" required />
                                </div>
                                <div className="input-group">
                                    <input name="list_title" onChange={handelChange} value={formvalues.list_title} className="m-0" type="text" placeholder="Contact Number" required />
                                </div>
                                
                                <div className="input-group style-2 ">
                                   
                                </div>
                                <button name="submit" type="submit" id="submit"
                                    className="sc-button style letter style-2"><span>Continue to Payment</span> </button>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="paym">
                <h3>Payment Method</h3>
               
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
  <Row>
    <Col sm={3}>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link eventKey="first">Tab 1</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="second">Tab 2</Nav.Link>
        </Nav.Item>
      </Nav>
    </Col>
    <Col sm={9}>
      <Tab.Content>
        <Tab.Pane eventKey="first">
          <Sonnet />
        </Tab.Pane>
        <Tab.Pane eventKey="second">
          <Sonnet />
        </Tab.Pane>
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>
            </div>
        </section>
       

        <Footer />
    </div>
  )
}

export default Chekout