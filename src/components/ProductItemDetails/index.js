// Write your code here
import './index.css'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsPlusSquare,BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
const apiStatusConstants={
    initial:'INITIAL',
    success:'SUCCESS',
    failure:'FAILURE',
    inProgress:'IN_PROGRESS',
}

class ProductItemDetails extends Component{
    state={productData:{},
    similarProductsData:[],
    apiStatus:apiStatusConstants.initial,
    quantity:1,
    }

    componentDidMount(){
        this.getProductsData()
    }

    getNewData=data=>({
        id:data.id,
        imageUrl:data.image_url,
        title:data.title,
        brand:data.brand,
        rating:data.rating,
        price:data.price,
        totalReviews:data.total_reviews,
        description:data.description,
        availability:data.availability,
    })

    getProductsData=async()=>{
        const {match}=this.props
        const {params}=match
        const {id}=params
        this.setState({
            apiStatus:apiStatusConstants.inProgress,
        })
        const jwtToken=Cookies.get('jwt_token')
        const apiUrl=`https://apis.ccbp.in/products/${id}`
        const options={
            headers:{
                Authorization:`Bearer ${jwtToken}`,
            },
            method:'GET',
        }
        const response=await fetch(apiUrl,options)
        if(response.ok===true){
            const fetchedData=await response.json()
            const updatedData=this.getNewData(fetchedData)
            const updatedSimilarProductsData=fetchedData.similar_products.map(similarProduct=>this.getNewData(similarProduct),)
            this.setState({
            productData:updatedData,
            similarProductsData:updatedSimilarProductsData,
            apiStatus:apiStatusConstants.success,
        })
        }
        if(response.status===404){
            this.setState({
                apiStatus:apiStatusConstants.failure,
            })
        }
    }

    displayLoadingView=()=>(
        <div data-testid="loader" className="loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
        </div>
    )

    displayFailureView=()=>(
        <div className="failure-view-container">
        <img src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png" alt="failure view" className="failure-img"/>
        <h1 className="failure-heading">Product Not Found</h1>
        <Link to="/products">
        <button type="button" className="continue-shopping-btn">Continue Shopping</button>
        </Link>
        </div>
    )

    displayProductsDetailsView=()=>{
        const {productData,similarProductsData,quantity}=this.state
        const {title,imageUrl,brand,price,rating,availability,totalReviews,description}=productData
        return(
            <div className="main-container">
            <div className="sub-container">
            <img src={imageUrl} alt="product" className="product-image"/>
            <div className="product-details">
            <h1 className="product-heading">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-reviews-container">
            <div className="rating-container">
            <p className="rating-desc">{rating}</p>
            <img src="https://assets.ccbp.in/frontend/react-js/star-img.png" className="star-img" alt="star"/>
            </div>
            <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-desc">{description}</p>
            <div className="label-name">
            <p className="label">Available:</p>
            <p className="value">{availability}</p>
            </div>
            <div className="label-name">
            <p className="label">Brand:</p>
            <p className="value">{brand}</p>
            </div>
            <hr className="horizontal-line"/>
            <div className="quantity-container">
            <button type="button" onClick={this.onDecrementQuantity} data-testid="minus" className="quantity-control-btn">
            <BsDashSquare className="quantity-control-img"/>
            </button>
            <p className="quantity">{quantity}</p>
            <button type="button" onClick={this.onIncrementQuantity} data-testid="plus" className="quantity-control-btn">
            <BsPlusSquare className="quantity-control-img"/>
            </button>
            </div>
            <button className="add-to-cart-btn" type="submit">ADD TO CART</button>
            </div>
            </div>
            <h1 className="sub-container-heading">Similar Products</h1>
            <ul className="sub-container-list-items">
            {similarProductsData.map(eachSimilarProduct=>(
                <SimilarProductItem key={eachSimilarProduct.id} productDetails={eachSimilarProduct}/>
            ))}
            </ul>
            </div>
        )
    }

    onIncrementQuantity=()=>{
        const {quantity}=this.state
        this.setState(prevState=>({quantity:prevState.quantity+1}))
    }

    onDecrementQuantity=()=>{
        const {quantity}=this.state
        if(quantity>1){
            this.setState(prevState=>({quantity:prevState.quantity-1}))
        }
    }

    displayProductsList=()=>{
        const {apiStatus}=this.state
        switch(apiStatus){
            case apiStatusConstants.success:
                return this.displayProductsDetailsView()
            case apiStatusConstants.failure:
                return this.displayFailureView()
            case apiStatusConstants.inProgress:
                return this.displayLoadingView()
            default:
                return null
        }
    }

    render(){
        return(
            <>
            <Header/>
            <div className="product-items-container">
            {this.displayProductsList()}
            </div>
            </>
        )
    }
}
export default ProductItemDetails