
import './index.scss';

function PricingTable() {
  return (
    <div className="pricing-table">
      <h1>Bảng Giá Dịch Vụ Ký Gửi Bán Cá Koi</h1>
      <p>
        Các mức phí được tính dựa trên số lượng cá, kích thước cá và thời gian ký gửi.
        Vui lòng tham khảo bảng giá dưới đây để biết thêm chi tiết.
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Số lượng cá</th>
            <th>Kích thước (cm)</th>
            <th>Thời gian ký gửi</th>
            <th>Phí ký gửi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>&le; 10</td>
            <td>&le; 40</td>
            <td>Bất kỳ</td>
            <td>20,000 VND/ngày</td>
          </tr>
          <tr>
            <td>&le; 20</td>
            <td>&le; 40</td>
            <td>Bất kỳ</td>
            <td>40,000 VND/ngày</td>
          </tr>
          <tr>
            <td>&le; 10</td>
            <td>&gt; 40</td>
            <td>Bất kỳ</td>
            <td>60,000 VND/ngày</td>
          </tr>
          <tr>
            <td>&gt; 10</td>
            <td>&gt; 40</td>
            <td>Bất kỳ</td>
            <td>90,000 VND/ngày</td>
          </tr>
          <tr>
            <td>Cá thể</td>
            <td>&le; 40</td>
            <td>&le; 60 ngày</td>
            <td>50,000 VND/ngày</td>
          </tr>
          <tr>
            <td>Cá thể</td>
            <td>&le; 40</td>
            <td>&gt; 60 ngày</td>
            <td>25,000 VND/ngày</td>
          </tr>
          <tr>
            <td>Cá thể</td>
            <td>&gt; 40</td>
            <td>&le; 60 ngày</td>
            <td>90,000 VND/ngày</td>
          </tr>
          <tr>
            <td>Cá thể</td>
            <td>&gt; 40</td>
            <td>&gt; 60 ngày</td>
            <td>70,000 VND/ngày</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PricingTable;
