import ReactDOM from 'react-dom/client'
import './index.css'
import {ElevatorReducer} from "./ElevatorReducer.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ElevatorReducer />
  // </React.StrictMode>,
)
