
import { Container } from "react-bootstrap";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Body from "./body";
const HomePage = () => {
  return (
    <div>
      <Container>
        <Header/>
        <Body/>
        <Footer/> 
      </Container>
    </div>
  );
};
export default HomePage;
