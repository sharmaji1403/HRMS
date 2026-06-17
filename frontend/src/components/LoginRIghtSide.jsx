import { ShieldIcon, UserIcon, ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

const LoginRightSide = () => {

  const portalOptions = [
    {
      to: "/login/HR",
      title: "HR Portal",
      description: "Sign in to manage the organization",
      icon: ShieldIcon
    },
    {
      to: "/login/Employee",
      title: "Employee Portal",
      description: "Sign in to access your employee resources",
      icon: UserIcon
    }
  ]

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen">
      <div className="w-full max-w-md animate-fade-in relative z-10">

        {/* header */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-3">Welcome Back</h2>
          <p className="text-slate-500">Select your portal to securely access the system</p>
        </div>

        {/* portal list */}
        <div className="space-y-4">
          {portalOptions.map((portal) => {
            const Icon = portal.icon;
            return (
              <Link key={portal.to} to={portal.to} className="group block bg-slate-100 border border-slate-200 rounded-lg p-5 sm:p-6 transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-50">
                <div className="relative z-10 flex items-center justify-between gap-4 sm:gap-5">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-indigo-500" />
                    <div>
                      <h3 className="text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{portal.title}</h3>
                      <p className="text-sm text-slate-500">{portal.description}</p>
                    </div>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-all duration-300" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center md:text-left text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Amol. All Rights Reserved.</p>
        </div>

      </div>
    </div>
  )
}

export default LoginRightSide  