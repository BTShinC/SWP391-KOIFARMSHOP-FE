import "./index.scss";
import PricingTable from "./PricingTable";
function AboutPage() {
  return (
    <div>
      <div className="about">
        <div className="page-content">
          <h1 className="title-1">Lịch sử và mục tiêu phát triển</h1>
          <p className="content">
            Koifish được thành lập vào năm 2015, bắt đầu với niềm đam mê cá Koi
            và mong muốn mang đến những chú cá Koi thuần chủng, chất lượng cao
            từ Nhật Bản. Qua nhiều năm phát triển, chúng tôi đã mở rộng quy mô
            hoạt động, xây dựng mối quan hệ vững chắc với các trang trại cá Koi
            nổi tiếng tại Nhật Bản và không ngừng cải thiện dịch vụ để phục vụ
            khách hàng tốt nhất.
            <br />
            Với mục tiêu trở thành nhà cung cấp cá Koi hàng đầu tại Việt Nam,
            Koifish cam kết mang đến không chỉ những chú Koi đẹp, khỏe mạnh, mà
            còn tạo nên những trải nghiệm đáng nhớ cho khách hàng. Chúng tôi
            không ngừng đầu tư vào công nghệ và nâng cao chất lượng dịch vụ để
            đạt đến sự hoàn thiện trong mỗi bước phát triển.
            <br />
          </p>
          <h1 className="title-2">Cam kết uy tín</h1>
          <p className="content">
            Nguồn gốc rõ ràng: Tất cả cá Koi tại Koifish đều được nhập khẩu từ
            các trang trại uy tín nhất Nhật Bản, đảm bảo độ thuần chủng và chất
            lượng cao.
            <br />
            Chất lượng vượt trội: Cá Koi của chúng tôi được nuôi dưỡng trong
            điều kiện tốt nhất, được kiểm tra kỹ lưỡng về sức khỏe trước khi đến
            tay khách hàng.
            <br />
            Tư vấn và hỗ trợ chuyên nghiệp: Đội ngũ chuyên gia giàu kinh nghiệm
            của chúng tôi sẽ đồng hành cùng bạn từ khâu chọn cá đến chăm sóc cá.
          </p>

          {/* Thêm phần Ký gửi */}
          <h1 className="title-2">Quy định và hướng dẫn ký gửi</h1>
          <p className="content">
            Tại Koifish, chúng tôi cung cấp dịch vụ ký gửi cá Koi với các quy
            định và hướng dẫn rõ ràng nhằm đảm bảo cá của bạn được chăm sóc tốt
            nhất. Dưới đây là các quy định và hướng dẫn về việc ký gửi:
          </p>
          <h2 className="subtitle">Quy định ký gửi</h2>
          <ul className="rules">
            <li>
              Cá ký gửi phải có giấy chứng nhận nguồn gốc rõ ràng (cá thể).
            </li>
            <li>Cá Koi phải có tình trạng sức khỏe tốt trước khi ký gửi.</li>
            <li>Thời gian ký gửi tối thiểu là 15 ngày.</li>
            <li>
              Trong quá trình ký gửi, KOIFISH sẽ kiểm tra và chăm sóc cá theo
              định kỳ.
            </li>
            <li>
              Nếu phát hiện cá bị bệnh trong thời gian ký gửi, khách hàng sẽ
              được thông báo và đưa ra phương án điều trị.
            </li>
            <li>
              Phí ký gửi sẽ được tính theo kích thước và số lượng cá, thời gian
              ký gửi, và tình trạng sức khỏe của cá.
            </li>
          </ul>

          <h2 className="subtitle">Hướng dẫn ký gửi</h2>
          <ul className="guideline">
            <li>
              Bước 1: Đăng ký tài khoản trên hệ thống của KOIFISH để theo dõi
              quá trình ký gửi.
            </li>
            <li>
              Bước 2:Chọn gói dịch vụ phù hợp và điền thông tin về cá cần ký gửi
            </li>
            <li>
              Bước 3:
              <ul>
                <li>
                  <strong>Ký gửi bán OFFLINE:</strong> Đối với các khách hàng
                  chọn ký gửi bán offline, bạn cần mang cá trực tiếp đến cửa
                  hàng KOIFISH. Tại đây, đội ngũ nhân viên của chúng tôi sẽ kiểm
                  tra tình trạng sức khỏe và thông tin về cá trước khi tiếp
                  nhận. Sau khi kiểm tra, cá sẽ được chăm sóc và đăng bán tại
                  KOIFISH.
                </li>
                <li>
                  <strong>Ký gửi bán ONLINE:</strong> Đối với các trang trại
                  chọn ký gửi bán online, nhân viên của KOIFISH sẽ đến trang
                  trại của bạn để kiểm tra tình trạng sức khỏe và các thông tin
                  liên quan đến cá. Tất cả thông tin trong đường link trang trại
                  cần phải chính xác. Sau khi kiểm tra, cá sẽ được mang về
                  KOIFISH để chăm sóc và đăng bán.
                </li>
                <li>
                  <strong>Ký gửi chăm sóc:</strong> Đối với dịch vụ ký gửi chăm
                  sóc, khách hàng có thể mang cá đến KOIFISH hoặc nếu bạn ký gửi
                  chăm sóc online, đội ngũ nhân viên của chúng tôi sẽ đến trang
                  trại của bạn để kiểm tra tình trạng sức khỏe của cá. Sau khi
                  hoàn tất kiểm tra, cá của bạn sẽ được đưa về KOIFISH và chăm
                  sóc theo các yêu cầu của bạn. KOIFISH cam kết sẽ chăm sóc cá
                  của bạn theo những tiêu chuẩn cao nhất và thông báo thường
                  xuyên về tình trạng sức khỏe của cá trong suốt quá trình chăm
                  sóc..
                </li>
              </ul>
            </li>
            <li>
              Bước 4: Theo dõi quá trình chăm sóc hoặc bán cá qua ứng dụng hoặc
              liên hệ với nhân viên hỗ trợ.
            </li>
            <li>Bước 5: Nhận cá lại sau khi hoàn tất thời gian ký gửi.</li>
          </ul>
          <h2 className="subtitle">Lưu ý quan trọng</h2>
          <div className="important-note">
            <h3>Ký gửi bán</h3>
            <p>
              Bạn chỉ có thể rút đơn ký gửi bán nếu đơn của bạn vẫn chưa được
              KOIFISH xem xét sau 3 ngày và sẽ không được rút cá trong quá trình
              đã đăng lên bán . Tiền hoa hồng sẽ là 20% so với giá đã được phê
              duyệt từ shop.
            </p>
            <p>
              Sau khi bán hoàn tất tiền sẽ được chuyển vào ví của bạn từ 1 đến 3
              ngày sau khi bán. Vui lòng kiểm tra ví và lịch sử giao dịch thường
              xuyên
            </p>
            <h3>Ký gửi chăm sóc</h3>
            <p>
              Khi xác nhận rút cá trong quá trình đang chăm sóc, shop sẽ cần từ
              1 đến 3 ngày để chuẩn bị và chi phí chăm sóc sẽ không được hoàn
              lại.
            </p>
            <p>
              Để chăm sóc tốt nhất cho cá của quý khách tối đa shop chỉ nhận 20
              cá thể cho gói chăm sóc theo lô. Quý khách lưu ý số lượng trước
              khi đặt gói chăm sóc.
            </p>
          </div>
          <p className="content">
            Với dịch vụ ký gửi tại Koifish, chúng tôi cam kết cá của bạn sẽ được
            chăm sóc kỹ lưỡng và tận tâm. Hãy liên hệ ngay để biết thêm chi tiết
            về dịch vụ.
          </p>
          <PricingTable />
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
