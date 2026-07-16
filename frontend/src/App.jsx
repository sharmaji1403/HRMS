import React from 'react'
import {Toaster} from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Landing from './Pages/Landing'
import Layout from './Pages/Layout'
import Dashboard from './Pages/Dashboard'
import Employees from './Pages/Employees'
import Attendance from './Pages/Attendance'
import Settings from './Pages/Settings'
import Payslips from './Pages/Payslips'
import Leave from './Pages/Leave'
import PrintPaySlip from './Pages/PrintPaySlip'
import { Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'




const App = () => {
  return (
   <> 
    <Toaster />
    <Routes>
      <Route path="/login" element={ <Landing />} />

      <Route path="/login/HR" element={<LoginForm role = "admin" title= "HR Portal" subtitle ="Sign in to manage the organization"/>}/>
      <Route path="/login/Employee" element={<LoginForm role = "employee" title= "Employee Portal" subtitle ="Sign in to manage your account"/>}/>


      <Route element = {<Layout />}>
      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="/employees" element={<Employees />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/payslips" element={<Payslips />} />
      <Route path="/leave" element={<Leave />} />
      </Route>
     <Route path="/print/payslip/:id" element={<PrintPaySlip />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
   </>
  )
}

export default App
