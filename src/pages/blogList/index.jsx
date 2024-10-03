import BlogPost from "./blogPost";
import "./index.scss";
import { Box, Button, Pagination } from "@mui/material";

const samplePosts = [
  {
    id: 1,
    title: "Hướng dẫn chăm sóc cá Koi cho người mới bắt đầu",
    content:
      "Cá Koi là một loài cá cảnh tuyệt đẹp và dễ chăm sóc nếu bạn biết cách. Bài viết này sẽ hướng dẫn bạn những bước cơ bản để nuôi cá Koi khỏe mạnh...",
    author: "Nguyễn Văn A",
    date: "2024-09-30",
  },
  {
    id: 2,
    title: "Tìm hiểu về môi trường sống lý tưởng cho cá Koi",
    content:
      "Môi trường sống là yếu tố quan trọng để cá Koi phát triển tốt. Bài viết này sẽ giúp bạn hiểu rõ về các yếu tố cần thiết trong việc xây dựng hồ cá Koi...",
    author: "Trần Thị B",
    date: "2024-09-29",
  },
  {
    id: 3,
    title: "Phân biệt các loại cá Koi phổ biến",
    content:
      "Có rất nhiều loại cá Koi với màu sắc và hình dáng khác nhau. Bài viết này sẽ giúp bạn nhận biết và phân biệt các loại cá Koi thông dụng...",
    author: "Lê Văn C",
    date: "2024-09-28",
  },
];

function BlogList() {
  return (
    <div className="blog-page">
      <div className="blog-page__container">
        {/* Phần bên trái: danh sách bài đăng */}
        <div className="blog-page__right">
          <div className="blog-page__title">
            <h1>Blog Cá Koi</h1>
          </div>
          <div className="blog-page__content">
            {samplePosts.map((post, index) => (
              <div key={index} className="blog-page__post">
                <BlogPost post={post} />
              </div>
            ))}
          </div>
          <Pagination count={10} variant="outlined" color="secondary" />
        </div>

        {/* Phần bên phải: khu vực khuyến nghị */}
        <div className="blog-page__recommend">
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              p: 8,
            }}
          >
            <h2>Bài viết xem nhiều nhất</h2>
            <ul>
              <li>
                <a
                  href="https://example.com/blog/koi-care-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hướng dẫn chăm sóc cá Koi cho người mới bắt đầu
                </a>
              </li>
              <li>
                <a
                  href="https://example.com/blog/koi-pond-setup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tìm hiểu về môi trường sống lý tưởng cho cá Koi
                </a>
              </li>
              <li>
                <a
                  href="https://example.com/blog/koi-varieties"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Phân biệt các loại cá Koi phổ biến
                </a>
              </li>
              <li>
                <a
                  href="https://example.com/blog/koi-pond-maintenance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bảo dưỡng hồ cá Koi hiệu quả
                </a>
              </li>
            </ul>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Xem thêm
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default BlogList;
