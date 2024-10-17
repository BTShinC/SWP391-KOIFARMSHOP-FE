import { Avatar, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";


UserAvatar.propTypes = {};

function UserAvatar(
) {
    // Tùy chỉnh Badge để hiển thị dot
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));
  return (
    <>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot" // Đây là phần quan trọng để hiển thị dot
      >
        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
      </StyledBadge>
    </>
  );
}

export default UserAvatar;
