import logo from "/public/images/logo.svg";
import bannerImage from "/public/images/banner.svg"; // Import your banner image
import "./index.scss";

function Banner({ title }) {
  return (
    <div className="banner-wraper">
      <div
        className="banner-container"
        style={{
          backgroundImage: `url(${bannerImage})`, // Only dynamically set the background image
        }}
      >
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="shop-name">{title}</h2>
      </div>
    </div>
  );
}

export default Banner;
