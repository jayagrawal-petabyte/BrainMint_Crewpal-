export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/403",
    element: <Forbidden />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute
        allowedRoles={[
          UserRole.ADMIN,
          UserRole.MANAGER,
          UserRole.EMPLOYEE,
        ]}
      >
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "tasks",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Tasks />
          </Suspense>
        ),
      },
      {
        path: "meetings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Meetings />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "organization",
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrganizationManagement />
          </Suspense>
        ),
      },
      {
        path: "organization/settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrganizationSettings />
          </Suspense>
        ),
      },
      {
        path: "teams",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Teams />
          </Suspense>
        ),
      },
      {
        path: "teams/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: "update-profile/:id",
        element: <UpdateProfile />,
      },
      {
        path: "reports",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Reports />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: <UnderConstruction title="Notifications Center" />,
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "scrum",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Scrum />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);