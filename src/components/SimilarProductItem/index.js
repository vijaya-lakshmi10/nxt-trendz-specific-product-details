// Write your code here
import './index.css'
const SimilarProductItem=props=>{
    const {productDetails}=props
    const {title,brand,rating,price,imageUrl}=productDetails
    return(
        <li className="similar-product-list-item">
        <img src={imageUrl} alt={`similar product ${title}`} className="similar-product-img"/>
        <p className="similar-product-title">{title}</p>
        <p className="similar-product-brand">by {brand}</p>
        <div className="similar-product-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
        <p className="similar-product-rating">{rating}</p>
        <img src="https://assets.ccbp.in/frontend/react-js/star-img.png" className="star-image" alt="star"/>
        </div>
        </div>
        </li>
    )
}
export default SimilarProductItem
