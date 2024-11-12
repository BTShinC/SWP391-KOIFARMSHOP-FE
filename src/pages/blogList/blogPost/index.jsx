import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./index.scss";

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
    navigate(`/blog/${postId}`);
  };

  return (
    <Card className="blog-post__card">
      <CardMedia
        component="img"
        alt={post.title}
        className="blog-post__image"
        image={post.image || "https://via.placeholder.com/360x200.png"}
      />
      <CardContent className="blog-post__content">
        <Typography variant="h6" className="blog-post__title">
          {post.title}
        </Typography>
        <Typography variant="body2" className="blog-post__description">
          {truncatedContent}
        </Typography>
        <Typography variant="caption" className="blog-post__date">
          Ngày đăng: {post.date}
        </Typography>
        <Typography variant="caption" className="blog-post__author">
          Tác giả: {post.author}
        </Typography>
      </CardContent>
      <CardActions className="blog-post__actions">
        <Button
          size="small"
          variant="contained"
          className="blog-post__button"
          onClick={() => handleClick(post.id)}
        >
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
}

export default BlogPost;
