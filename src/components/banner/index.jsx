import logo from "/public/images/logo.svg";
import bannerImage from "/public/images/banner.svg"; // Import your background image
import "./index.scss";

function Banner({ title }) {
  return (
    <div className="banner-wrapper">
      <div className="banner-background">
        {/* This div will hold the background image */}
        <img src={bannerImage} alt="Banner Background" className="background-image" />
      </div>
      <div className="banner-content">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="shop-name">{title}</h2>
      </div>
    </div>
  );
}

export default Banner;
