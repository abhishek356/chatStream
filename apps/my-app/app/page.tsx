import Home from "./home/page";
export default function Container() {
  return (
    <div style = {{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
      <Home />
    </div>
  );
}
