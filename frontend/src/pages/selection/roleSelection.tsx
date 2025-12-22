// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { User, Eye, Edit, FileCheck, LogOut } from 'lucide-react';

// const RoleSelection = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));

//   const handleRoleSelect = (role) => {
//     // Store selected role in localStorage
//     localStorage.setItem('currentRole', role);
    
//     // Redirect based on role
//     switch(role) {
//       case 'author':
//         navigate('/author-dashboard');
//         break;
//       case 'reviewer':
//         navigate('/reviewer-dashboard');
//         break;
//       case 'editor':
//         navigate('/editor-dashboard');
//         break;
//       default:
//         navigate('/');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('currentRole');
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-4xl">
//         {/* Header */}
//         <div className="mb-12 text-center">
//           <h1 className="mb-4 text-3xl font-bold text-gray-900">
//             Welcome back, {user?.firstName}!
//           </h1>
//           <p className="text-lg text-gray-600">
//             Choose how you want to access the system
//           </p>
//         </div>

//         {/* Role Selection Cards - TEMPORARY: All roles visible for testing */}
//         <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {/* Author Role - Always visible for testing */}
//           <div className="rounded-lg border border-blue-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
//             <div className="mb-4 flex items-center gap-3">
//               <div className="rounded-full bg-blue-100 p-3">
//                 <User className="text-blue-600" size={24} />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900">Author</h3>
//             </div>
//             <p className="mb-4 text-gray-600">
//               Submit and manage your research manuscripts, track submission status
//             </p>
//             <button
//               onClick={() => handleRoleSelect('author')}
//               className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
//             >
//               Enter as Author
//             </button>
//           </div>

//           {/* Reviewer Role - Always visible for testing */}
//           <div className="rounded-lg border border-green-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
//             <div className="mb-4 flex items-center gap-3">
//               <div className="rounded-full bg-green-100 p-3">
//                 <FileCheck className="text-green-600" size={24} />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900">Reviewer</h3>
//             </div>
//             <p className="mb-4 text-gray-600">
//               Review assigned manuscripts, provide feedback and recommendations
//             </p>
//             <button
//               onClick={() => handleRoleSelect('reviewer')}
//               className="w-full rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
//             >
//               Enter as Reviewer
//             </button>
//           </div>

//           {/* Editor Role - Always visible for testing */}
//           <div className="rounded-lg border border-purple-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
//             <div className="mb-4 flex items-center gap-3">
//               <div className="rounded-full bg-purple-100 p-3">
//                 <Edit className="text-purple-600" size={24} />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900">Editor</h3>
//             </div>
//             <p className="mb-4 text-gray-600">
//               Manage manuscript workflow, assign reviewers, make editorial decisions
//             </p>
//             <button
//               onClick={() => handleRoleSelect('editor')}
//               className="w-full rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
//             >
//               Enter as Editor
//             </button>
//           </div>

//           {/* Viewer Role (Default for all) */}
//           <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
//             <div className="mb-4 flex items-center gap-3">
//               <div className="rounded-full bg-gray-100 p-3">
//                 <Eye className="text-gray-600" size={24} />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900">Viewer</h3>
//             </div>
//             <p className="mb-4 text-gray-600">
//               Browse published articles, read research papers, explore journal content
//             </p>
//             <button
//               onClick={() => handleRoleSelect('viewer')}
//               className="w-full rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
//             >
//               Enter as Viewer
//             </button>
//           </div>
//         </div>

//         {/* Switch Role Button */}
//         <div className="mb-6 text-center">
//           <button
//             onClick={() => navigate('/role-selection')}
//             className="text-blue-600 underline hover:text-blue-700"
//           >
//             Switch Role
//           </button>
//         </div>

//         {/* Logout Button */}
//         <div className="text-center">
//           <button
//             onClick={handleLogout}
//             className="mx-auto flex items-center gap-2 text-red-600 hover:text-red-700"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleSelection;




import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit, FileCheck, LogOut, Crown } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Backend ke according available roles check karo
  const getAvailableRoles = () => {
    const roles = [];
    const userRoles = user?.roles || {};
    
    if (userRoles.author) roles.push('author');
    if (userRoles.reviewer) roles.push('reviewer');
    if (userRoles.editor) roles.push('editor');
    if (userRoles.editorInChief) roles.push('editorInChief');
    
    return roles;
  };

  const availableRoles = getAvailableRoles();

  const handleRoleSelect = (role) => {
    localStorage.setItem('currentRole', role);
    
    // Dispatch custom event to notify Header component of role change
    window.dispatchEvent(new Event('roleChanged'));
    
    switch(role) {
      case 'author':
        navigate('/author-dashboard');
        break;
      case 'reviewer':
        navigate('/reviewer-dashboard');
        break;
      case 'editor':
        navigate('/editor-dashboard');
        break;
      case 'editorInChief':
        navigate('/admin-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentRole');
    navigate('/login');
  };

  const getRoleConfig = (role) => {
    const config = {
      author: {
        title: 'Author',
        icon: User,
        description: 'Submit and manage your research manuscripts, track submission status',
        color: 'blue',
        buttonText: 'Enter as Author'
      },
      reviewer: {
        title: 'Reviewer',
        icon: FileCheck,
        description: 'Review assigned manuscripts, provide feedback and recommendations',
        color: 'green',
        buttonText: 'Enter as Reviewer'
      },
      editor: {
        title: 'Editor',
        icon: Edit,
        description: 'Manage manuscript workflow, assign reviewers, make editorial decisions',
        color: 'purple',
        buttonText: 'Enter as Editor'
      },
      editorInChief: {
        title: 'Editor-in-Chief',
        icon: Crown,
        description: 'Overall system administration, user management, and final decisions',
        color: 'red',
        buttonText: 'Enter as Editor-in-Chief'
      }
    };
    
    return config[role] || { title: role, icon: User, description: '', color: 'gray', buttonText: `Enter as ${role}` };
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: { border: 'border-blue-200', bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
      green: { border: 'border-green-200', bg: 'bg-green-100', text: 'text-green-600', button: 'bg-green-600 hover:bg-green-700' },
      purple: { border: 'border-purple-200', bg: 'bg-purple-100', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700' },
      red: { border: 'border-red-200', bg: 'bg-red-100', text: 'text-red-600', button: 'bg-red-600 hover:bg-red-700' },
      gray: { border: 'border-gray-200', bg: 'bg-gray-100', text: 'text-gray-600', button: 'bg-gray-600 hover:bg-gray-700' }
    };
    
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-lg text-gray-600">
            Choose how you want to access the system
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Available roles based on your permissions
          </div>
        </div>

        {/* Role Selection Cards - Only show available roles */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableRoles.map(role => {
            const config = getRoleConfig(role);
            const Icon = config.icon;
            const colors = getColorClasses(config.color);
            
            return (
              <div 
                key={role} 
                className={`bg-white rounded-lg shadow-md p-6 border ${colors.border} hover:shadow-lg transition-shadow`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`p-3 rounded-full ${colors.bg}`}>
                    <Icon className={colors.text} size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{config.title}</h3>
                </div>
                <p className="mb-4 text-gray-600">
                  {config.description}
                </p>
                <button
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full text-white py-2 px-4 rounded-md transition-colors ${colors.button}`}
                >
                  {config.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* User Info */}
        <div className="mb-6 rounded-lg bg-white p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold">Your Account Information</h3>
          <p className="text-gray-600">
            <strong>Name:</strong> {user?.firstName} {user?.lastName} | 
            <strong> Email:</strong> {user?.email} | 
            <strong> Affiliation:</strong> {user?.profile?.affiliation || 'Not specified'}
          </p>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="mx-auto flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;