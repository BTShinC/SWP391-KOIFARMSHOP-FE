import logo from "/public/images/logo.svg";
import "./index.scss";

function Banner({ title }) {
  return (
    <div className="banner-wraper">
      <div className="banner-container">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="shop-name">{title}</h2>
      </div>
    </div>
  );
}

export default Banner;
