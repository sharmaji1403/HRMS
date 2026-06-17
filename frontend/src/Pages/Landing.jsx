import LoginLeftSide from '../components/LoginLeftSide'
import LoginRIghtSide from '../components/LoginRIghtSide'

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />
      <LoginRIghtSide />
    </div>
  )
}

export default Landing