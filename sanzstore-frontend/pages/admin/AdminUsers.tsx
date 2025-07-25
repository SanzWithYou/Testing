
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { fetchAllUsers, updateUserRoles, updateUserStatus } from '../../services/api';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeftRight, Ban } from '../../components/Icons';
import Modal from '../../components/Modal';

const AVAILABLE_ROLES = ['admin', 'seller', 'user'];

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();
    const { refreshUser, user: adminUser } = useAuth();
    
    // State for modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newRoles, setNewRoles] = useState<string[]>([]);

    const getUsers = async () => {
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(`Failed to fetch users: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        setLoading(true);
        getUsers();
    }, []);
    
    const openRoleModal = (user: User) => {
        setSelectedUser(user);
        setNewRoles([...user.roles]); // Copy existing roles
        setIsModalOpen(true);
    };

    const handleCheckboxChange = (role: string, isChecked: boolean) => {
        setNewRoles(prevRoles => {
            const updatedRoles = isChecked
                ? [...prevRoles, role]
                : prevRoles.filter(r => r !== role);
            
            // Ensure 'user' role is always present
            if (!updatedRoles.includes('user')) {
                updatedRoles.push('user');
            }
            return updatedRoles;
        });
    };
    
    const handleRoleChange = async () => {
        if (!selectedUser) return;
        try {
            await updateUserRoles(selectedUser.id, newRoles);
            addToast(`User ${selectedUser.name}'s roles updated.`, 'success');
            setIsModalOpen(false);
            setSelectedUser(null);
            await getUsers(); // Refresh data list
            if (adminUser?.id === selectedUser.id) {
                await refreshUser(); // Refresh auth context if admin changes their own roles
            }
        } catch(e: any) {
            addToast(`Failed to update user roles: ${e.message}`, 'error');
        }
    };

    const handleStatusChange = async (user: User) => {
        const newStatus = user.status === 'active' ? 'blocked' : 'active';
        const action = newStatus === 'blocked' ? 'block' : 'unblock';
        if (window.confirm(`Are you sure you want to ${action} user ${user.name}?`)) {
            try {
                await updateUserStatus(user.id, newStatus);
                addToast(`User has been ${action}ed.`, 'success');
                await getUsers(); // Refresh data
                 if (adminUser?.id === user.id) {
                    await refreshUser(); // Refresh auth context if admin blocks themselves
                }
            } catch(e: any) {
                addToast(`Failed to ${action} user: ${e.message}`, 'error');
            }
        }
    };

    const RoleBadge: React.FC<{role: string}> = ({role}) => {
        let colorClass = 'bg-slate-700 text-slate-300';
        if (role === 'admin') colorClass = 'bg-primary/20 text-primary';
        if (role === 'seller') colorClass = 'bg-green-500/20 text-green-400';
        return <span className={`capitalize px-2 py-1 text-xs font-bold rounded-full ${colorClass}`}>{role}</span>
    }

    const columns = [
        { header: 'ID', accessor: (item: User) => <span title={item.id} className="font-mono">{String(item.id).substring(0,8)}...</span> },
        { header: 'Name', accessor: 'name' as keyof User },
        { header: 'Email', accessor: 'email' as keyof User },
        { 
            header: 'Roles', 
            accessor: (item: User) => (
                <div className="flex gap-1.5 flex-wrap">
                    {item.roles.map(role => <RoleBadge key={role} role={role} />)}
                </div>
            )
        },
         { 
            header: 'Status', 
            accessor: (item: User) => {
                 const isActive = item.status === 'active';
                 return <span className={`capitalize px-2 py-1 text-xs font-bold rounded-full ${isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{item.status}</span>
            }
        },
    ];

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    return (
        <div>
            <DataTable
                columns={columns}
                data={users.map(u => ({...u, id: String(u.id)}))}
                 actions={(user) => (
                    <>
                        <button 
                            onClick={() => openRoleModal(user)} 
                            className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            title="Change Role"
                        >
                            <ArrowLeftRight className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleStatusChange(user)} 
                            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                        >
                            <Ban className="w-4 h-4" />
                        </button>
                    </>
                )}
            />
            
            {/* Change Role Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Change Roles for ${selectedUser?.name}`}>
                <div className="space-y-4">
                    <p className="text-slate-400">Select the roles for this user.</p>
                    <div className="space-y-2">
                        {AVAILABLE_ROLES.filter(r => r !== 'user').map(role => ( // 'user' role is default, not selectable
                            <label key={role} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded bg-slate-800 border-slate-600 text-primary focus:ring-primary"
                                    checked={newRoles.includes(role)}
                                    onChange={(e) => handleCheckboxChange(role, e.target.checked)}
                                />
                                <span className="font-semibold text-white capitalize">{role}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-white bg-slate-600/80 rounded-lg hover:bg-slate-600">
                            Cancel
                        </button>
                         <button onClick={handleRoleChange} className="px-4 py-2 text-sm font-semibold text-white bg-primary/80 rounded-lg hover:bg-primary">
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminUsers;