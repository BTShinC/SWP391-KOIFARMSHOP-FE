import "./index.scss";
function AdminHeader() {
  return (
    <div className="content__header">
      <div className="content__welcome">
        <h3>Xin chào ...</h3>
        <span>Chào mừng trở lại</span>
      </div>
      <div className="user-info">
        <div className="user-info__avatar">
          <img className="avatar-placeholder" src="/images/logo.svg" />
        </div>
        <div className="user-info__details">      
          <span className="user-info__name">Lekan Okeowo</span>
          <span className="user-info__role">Admin</span>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default AdminHeader;
