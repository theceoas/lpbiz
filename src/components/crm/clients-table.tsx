'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Mail, Phone, Building, Calendar, Edit, Trash2, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

interface Client {
  id: string
  email: string
  name: string
  company?: string
  phone?: string
  status: string
  total_value?: number
  created_at: string
  last_contact?: string
}

interface ClientsTableProps {
  onStatsUpdate: () => void
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  prospect: 'bg-blue-100 text-blue-800',
  churned: 'bg-red-100 text-red-800'
}

export function ClientsTable({ onStatsUpdate }: ClientsTableProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setClients(clients.filter(client => client.id !== id))
      onStatsUpdate()
    } catch (error) {
      console.error('Error deleting client:', error)
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Clients
          </h2>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-slate-500">Loading clients...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          Clients ({filteredClients.length})
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        {filteredClients.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {clients.length === 0 ? 'No clients found. Add your first client!' : 'No clients match your filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-slate-800">{client.name}</div>
                        <div className="flex items-center text-sm text-slate-500">
                          <Mail className="h-3 w-3 mr-1" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center text-sm text-slate-500">
                            <Phone className="h-3 w-3 mr-1" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {client.company ? (
                        <div className="flex items-center text-slate-700">
                          <Building className="h-4 w-4 mr-2 text-slate-400" />
                          {client.company}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={statusColors[client.status as keyof typeof statusColors]}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {client.total_value ? (
                        <div className="flex items-center font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          <DollarSign className="h-3 w-3 mr-1 text-blue-600" />
                          {client.total_value.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {client.last_contact ? (
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(client.last_contact), 'MMM d, yyyy')}
                        </div>
                      ) : (
                        <span className="text-slate-400">Never</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(client.created_at), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-slate-200 hover:border-blue-400 hover:bg-blue-50">
                          <Edit className="h-3 w-3 text-slate-600" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteClient(client.id)}
                          className="border-slate-200 hover:border-red-400 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 text-slate-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}