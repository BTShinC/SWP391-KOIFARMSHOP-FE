import poster from "swp391-koifarmshop-fe/public/images/poster.svg";

import "./index.scss";
import { Link } from "react-router-dom";
import Carousel from "../../../components/carousel";
import { Button, Card } from "antd";
import Meta from "antd/es/card/Meta";

import koi1 from "swp391-koifarmshop-fe/public/images/koi1.svg";
import koi2 from "swp391-koifarmshop-fe/public/images/koi2.svg";
import koi3 from "swp391-koifarmshop-fe/public/images/koi3.svg";
import koi4 from "swp391-koifarmshop-fe/public/images/koi4.svg";

function Body() {
  const koiImages = [
    { id: 1, imgSrc: koi1, title: "Asagi" },
    { id: 2, imgSrc: koi2, title: "Showa Sanshoku" },
    { id: 3, imgSrc: koi3, title: "Karashi" },
    { id: 4, imgSrc: koi4, title: "Benigoi" },
  ];

  return (
    <body className="body">
      <div className="body__poster">
        <img src={poster} alt="Poster" />
      </div>

      <div className="body__content">
        <h2>Các loại cá Koi tiêu biểu tại SHOP</h2>
        <div className="body__content__image">
          <ul className="image-list">
            {koiImages.map((koi) => (
              <li key={koi.id}>
                <Link to={`/koi/${koi.id}`}>
                  <Card
                    hoverable
                    cover={<img src={koi.imgSrc} alt={koi.title} />}
                  >
                    <Meta title={koi.title} />
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="body__carousel le">
        <h2>Mua lẻ</h2>
        <Carousel />
        <Button className="more-button">Xem thêm</Button>
      </div>

      <div className="body__carousel lo">
        <h2>Mua lô</h2>
        <Carousel />
        <Button className="more-button">Xem thêm</Button>
      </div>
    </body>
  );
}

export default Body;
