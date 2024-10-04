import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

BlogPost.propTypes = {
  post: PropTypes.object.isRequired,
};

function BlogPost({ post }) {
  const navigate = useNavigate();
  const truncatedContent =
    post.content.length > 100
      ? post.content.substring(0, 100) + "..."
      : post.content;
  const handleClick = (postId) => {
    // Điều hướng đến trang chi tiết của bài đăng
    navigate(`/blog/${postId}`);
  };
  return (
    <Box sx={{ mb: 4 }}>
      <Card
        sx={{
          maxWidth: 345,
          boxShadow: 3,
          "&:hover": {
            boxShadow: 6,
          },
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          alt={post.title}
          height="180"
          image="https://plus.unsplash.com/premium_photo-1723672584706-42c474c77fd1?q=80&w=1998&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Sử dụng hình ảnh từ URL động
        />
        <CardContent sx={{ backgroundColor: "#f5f5f5" }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ color: "#333" }}
          >
            {post.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", mb: 1.5 }}>
            {truncatedContent}
          </Typography>
          <Typography variant="body2" sx={{ color: "#888" }}>
            Ngày đăng:{post.date}
          </Typography>
          <Typography variant="body2" sx={{ color: "#888", mt: 1 }}>
            Tác giả:{post.author}
          </Typography>
        </CardContent>
        <CardActions sx={{ backgroundColor: "#f5f5f5" }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleClick(post.id)}
          >
            Xem chi tiết
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default BlogPost;
