import { Routes, Route } from 'react-router-dom'
import RequireAuth from './RequireAuth.jsx'


import Landing from '../pages/user/Landing.jsx'
import Login from '../pages/user/Login.jsx'
import Register from '../pages/user/Register.jsx'
import AllUsers from '../pages/user/AllUsers.jsx'


import AddRegulator from '../pages/admin/AddRegulator.jsx'
import AllRegulators from '../pages/admin/AllRegulators.jsx'
import AddObligation from '../pages/admin/AddObligation.jsx'
import AdminAllObligations from '../pages/admin/AllObligations.jsx'
import AddDeadline from '../pages/admin/AddDeadline.jsx'
import AdminCalendarView from '../pages/admin/CalendarView.jsx'

import Notifications from '../pages/user/Notifications.jsx'

import CreateReturn from '../pages/co/CreateReturn.jsx'
import MyReturns from '../pages/co/MyReturns.jsx'
import ReturnsByStatus from '../pages/co/ReturnsByStatus.jsx'
import CalendarView from '../pages/co/CalendarView.jsx'
import CreateDataRequest from '../pages/co/CreateDataRequest.jsx'
import ViewDataRequests from '../pages/co/ViewDataRequests.jsx'


import MyDataRequests from '../pages/dataowner/MyDataRequests.jsx'
import AddCertification from '../pages/dataowner/AddCertification.jsx'


import AddPenalty from '../pages/legalofficer/AddPenalty.jsx'
import LegalAllPenalties from '../pages/legalofficer/AllPenalties.jsx'


import AddAuditReview from '../pages/auditor/AddAuditReview.jsx'
import MyAuditReviews from '../pages/auditor/MyAuditReviews.jsx'
import AuditorAllReturns from '../pages/auditor/AllReturns.jsx'
import AuditorAllPenalties from '../pages/auditor/AllPenalties.jsx'
import AuditorAllDataRequests from '../pages/auditor/AllDataRequests.jsx'
import AuditorAllObligations from '../pages/auditor/AllObligations.jsx'

import CCODashboard from '../pages/cco/CCODashboard.jsx'
import CCOAllReturns from '../pages/cco/AllReturns.jsx'
import CCOAllObligations from '../pages/cco/AllObligations.jsx'
import CCOCalendarView from '../pages/cco/CalendarView.jsx'
import CCOAllPenalties from '../pages/cco/AllPenalties.jsx'
import CCOAllAudits from '../pages/cco/AllAudits.jsx'

function AppRoutes() {
  return (
    <Routes>
      
      <Route path="/" element={<Login />} />
      
    
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users" element={<RequireAuth roles={['ADMIN']}><AllUsers /></RequireAuth>} />

    
      <Route path="/admin/add-regulator"  element={<RequireAuth roles={['ADMIN']}><AddRegulator /></RequireAuth>} />
      <Route path="/admin/all-regulators" element={<RequireAuth roles={['ADMIN']}><AllRegulators /></RequireAuth>} />
      <Route path="/admin/add-obligation" element={<RequireAuth roles={['ADMIN']}><AddObligation /></RequireAuth>} />
      <Route path="/admin/all-obligations" element={<RequireAuth roles={['ADMIN']}><AdminAllObligations /></RequireAuth>} />
      <Route path="/admin/add-deadline" element={<RequireAuth roles={['ADMIN']}><AddDeadline /></RequireAuth>} />
      <Route path="/admin/calendar" element={<RequireAuth roles={['ADMIN']}><AdminCalendarView /></RequireAuth>} />

     
      <Route path="/co/create-return" element={<RequireAuth roles={['COMPLIANCE_OFFICER']}><CreateReturn /></RequireAuth>} />
      <Route path="/co/my-returns" element={<RequireAuth roles={['COMPLIANCE_OFFICER']}><MyReturns /></RequireAuth>} />
      <Route path="/co/returns-by-status" element={<RequireAuth roles={['COMPLIANCE_OFFICER']}><ReturnsByStatus /></RequireAuth>} />
      <Route path="/co/calendar" element={<RequireAuth roles={['COMPLIANCE_OFFICER']}><CalendarView /></RequireAuth>} />
      <Route path="/co/create-data-request" element={<RequireAuth roles={['COMPLIANCE_OFFICER']}><CreateDataRequest /></RequireAuth>} />
      <Route path="/co/view-data-requests" element={<RequireAuth roles={['COMPLIANCE_OFFICER']}><ViewDataRequests /></RequireAuth>} />

     
      <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />

    
      <Route path="/dataowner/my-requests" element={<RequireAuth roles={['DATA_OWNER']}><MyDataRequests /></RequireAuth>} />
      <Route path="/dataowner/add-certification" element={<RequireAuth roles={['DATA_OWNER']}><AddCertification /></RequireAuth>} />

      <Route path="/legal/add-penalty" element={<RequireAuth roles={['LEGAL_OFFICER']}><AddPenalty /></RequireAuth>} />
      <Route path="/legal/all-penalties" element={<RequireAuth roles={['LEGAL_OFFICER']}><LegalAllPenalties /></RequireAuth>} />

   
      <Route path="/auditor/add-review" element={<RequireAuth roles={['INTERNAL_AUDITOR']}><AddAuditReview /></RequireAuth>} />
      <Route path="/auditor/my-reviews" element={<RequireAuth roles={['INTERNAL_AUDITOR']}><MyAuditReviews /></RequireAuth>} />
      <Route path="/auditor/all-returns" element={<RequireAuth roles={['INTERNAL_AUDITOR']}><AuditorAllReturns /></RequireAuth>} />
      <Route path="/auditor/all-penalties" element={<RequireAuth roles={['INTERNAL_AUDITOR']}><AuditorAllPenalties /></RequireAuth>} />
      <Route path="/auditor/all-data-requests" element={<RequireAuth roles={['INTERNAL_AUDITOR']}><AuditorAllDataRequests /></RequireAuth>} />
      <Route path="/auditor/all-obligations" element={<RequireAuth roles={['INTERNAL_AUDITOR']}><AuditorAllObligations /></RequireAuth>} />

     
      <Route path="/cco/dashboard" element={<RequireAuth roles={['CCO']}><CCODashboard /></RequireAuth>} />
      <Route path="/cco/all-returns" element={<RequireAuth roles={['CCO']}><CCOAllReturns /></RequireAuth>} />
      <Route path="/cco/all-obligations" element={<RequireAuth roles={['CCO']}><CCOAllObligations /></RequireAuth>} />
      <Route path="/cco/calendar" element={<RequireAuth roles={['CCO']}><CCOCalendarView /></RequireAuth>} />
      <Route path="/cco/all-penalties" element={<RequireAuth roles={['CCO']}><CCOAllPenalties /></RequireAuth>} />
      <Route path="/cco/all-audits" element={<RequireAuth roles={['CCO']}><CCOAllAudits /></RequireAuth>} />
    </Routes>
  )
}

export default AppRoutes