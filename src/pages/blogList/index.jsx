import BlogPost from "./blogPost";
import "./index.scss";
import { Box, Button, Pagination } from "@mui/material";

const samplePosts = [
  {
    id: 1,
    title: "Hướng dẫn chăm sóc cá Koi cho người mới bắt đầu",
    content:
      "Cá Koi là một loài cá cảnh tuyệt đẹp và dễ chăm sóc nếu bạn biết cách. Bài viết này sẽ hướng dẫn bạn những bước cơ bản để nuôi cá Koi khỏe mạnh. Để bắt đầu, bạn cần chuẩn bị hồ nuôi cá với kích thước phù hợp và hệ thống lọc nước. Nước trong hồ cần được duy trì ở mức sạch và giàu oxy. Ngoài ra, bạn cũng cần quan tâm đến việc cho cá ăn đúng cách, đảm bảo chế độ dinh dưỡng cân bằng và tránh việc cho ăn quá nhiều. Kiểm tra sức khỏe của cá định kỳ và đảm bảo chúng không bị nhiễm bệnh. Nếu phát hiện dấu hiệu bất thường, cần có biện pháp xử lý kịp thời để bảo vệ sức khỏe cho đàn cá Koi của bạn...",
    author: "Nguyễn Văn A",
    date: "2024-09-30",
    image:
      "https://plus.unsplash.com/premium_photo-1723672584706-42c474c77fd1?q=80&w=1998&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Tìm hiểu về môi trường sống lý tưởng cho cá Koi",
    content:
      "Môi trường sống của cá Koi đóng vai trò quan trọng trong việc giúp chúng phát triển khỏe mạnh. Để xây dựng một môi trường lý tưởng, bạn cần lưu ý đến chất lượng nước, nhiệt độ, và hệ thống lọc nước. Nước cần được duy trì ở nhiệt độ từ 20-25 độ C, độ pH ổn định từ 7.0-8.0. Hệ thống lọc phải hoạt động hiệu quả để loại bỏ các chất thải và vi khuẩn có hại trong hồ. Đồng thời, cần đảm bảo hồ có đủ ánh sáng tự nhiên nhưng không quá gay gắt để tránh ảnh hưởng đến sức khỏe của cá. Bổ sung thêm các loại cây thủy sinh trong hồ có thể giúp cải thiện chất lượng nước và cung cấp nơi trú ẩn cho cá...",
    author: "Trần Thị B",
    date: "2024-09-29",
    image:
      "https://plus.unsplash.com/premium_photo-1688358602051-44c03bdaf13a?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Phân biệt các loại cá Koi phổ biến",
    content:
      "Cá Koi có rất nhiều loại với màu sắc và hình dáng đa dạng. Một số loại cá Koi phổ biến có thể kể đến như Kohaku, Sanke, Showa, Ogon và Asagi. Kohaku là loại cá Koi với thân trắng và các đốm đỏ, được xem là biểu tượng của sự tinh khiết và thanh lịch. Sanke có hình dáng tương tự Kohaku nhưng thêm các đốm đen trên lưng. Showa là một trong những loại phức tạp nhất với sự kết hợp giữa màu đen, đỏ, và trắng trên thân. Ogon là loại cá Koi toàn thân vàng hoặc bạc, tượng trưng cho sự giàu có. Asagi với thân xanh lơ và vảy sáng bạc tạo nên vẻ đẹp độc đáo. Việc nhận biết và phân biệt các loại cá Koi không chỉ giúp bạn lựa chọn cá phù hợp mà còn hiểu rõ hơn về sự đa dạng và độc đáo của loài cá này...",
    author: "Lê Văn C",
    date: "2024-09-28",
    image:
      "https://plus.unsplash.com/premium_photo-1688848092212-d074fe0a1e1f?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Chế độ dinh dưỡng hoàn hảo cho cá Koi",
    content:
      "Chế độ dinh dưỡng là yếu tố quan trọng giúp cá Koi phát triển khỏe mạnh và giữ được màu sắc rực rỡ. Thức ăn cho cá Koi cần chứa đủ các chất dinh dưỡng như protein, chất béo, vitamin và khoáng chất. Protein là thành phần chính giúp cá tăng trưởng, chiếm khoảng 30-40% khẩu phần ăn. Chất béo cần thiết để cung cấp năng lượng cho cá nhưng không nên vượt quá 5% để tránh gây béo phì. Vitamin và khoáng chất giúp tăng cường hệ miễn dịch và hỗ trợ quá trình trao đổi chất. Bên cạnh việc chọn thức ăn chất lượng, bạn cần lưu ý đến lượng thức ăn phù hợp với kích thước và độ tuổi của cá. Tránh việc cho cá ăn quá nhiều vì có thể gây ô nhiễm nước và ảnh hưởng đến sức khỏe của cá...",
    author: "Hoàng Thị D",
    date: "2024-09-27",
    image:
      "https://plus.unsplash.com/premium_photo-1688781564943-bb78af8db4bc?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
];

function BlogList() {
  return (
    <div className="blog-page">
      <div className="blog-page__container">
        {/* Phần bên trái: danh sách bài đăng */}
        <div className="blog-page__right">
          <div className="blog-page__title">
            <h1>Các bài viết mới nhất</h1>
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
