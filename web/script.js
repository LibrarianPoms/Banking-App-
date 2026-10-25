// API client for backend communication
const API = {
    // Get all clients
    async getClients() {
        const response = await fetch('/api/clients');
        return await response.json();
    },
    
    // Get all accounts
    async getAccounts() {
        const response = await fetch('/api/accounts');
        return await response.json();
    },
    
    // Get all transactions
    async getTransactions() {
        const response = await fetch('/api/transactions');
        return await response.json();
    },
    
    // Get all employees
    async getEmployees() {
        const response = await fetch('/api/employees');
        return await response.json();
    },
    
    // Get all admins
    async getAdmins() {
        const response = await fetch('/api/admins');
        return await response.json();
    },
    
    // Create new account
    async createAccount(clientId, accountType, initialBalance) {
        const response = await fetch('/api/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId,
                type: accountType,
                solde: initialBalance
            })
        });
        return await response.json();
    }
};

// Cache for data
let cachedData = {
    clients: [],
    accounts: [],
    transactions: [],
    employees: [],
    admins: []
};

// Load initial data
async function loadInitialData() {
    try {
        cachedData.clients = await API.getClients();
        cachedData.accounts = await API.getAccounts();
        cachedData.transactions = await API.getTransactions();
        cachedData.employees = await API.getEmployees();
        cachedData.admins = await API.getAdmins();
        console.log('Initial data loaded successfully');
    } catch (error) {
        console.error('Error loading initial data:', error);
        // Fallback to sample data if API fails
        cachedData = {
            clients: [],  // No default clients
            employees: [], // No default employees
            admins: [
                { id: "A001", nom: "Admin" }
            ],
            accounts: [],  // No default accounts
            transactions: []
        };
        alert('Connexion au serveur impossible. Mode hors ligne activé.');
    }
}

// Load data when page loads
window.addEventListener('load', loadInitialData);

// DOM elements
const clientLink = document.getElementById('client-link');
const employeeLink = document.getElementById('employee-link');
const adminLink = document.getElementById('admin-link');

const clientSection = document.getElementById('client-section');
const employeeSection = document.getElementById('employee-section');
const adminSection = document.getElementById('admin-section');

// Navigation
clientLink.addEventListener('click', function(e) {
    e.preventDefault();
    showSection(clientSection);
    updateActiveLink(clientLink);
});

employeeLink.addEventListener('click', function(e) {
    e.preventDefault();
    showSection(employeeSection);
    updateActiveLink(employeeLink);
    
    // Refresh employee dashboard if user is logged in
    const employeeDashboard = document.getElementById('employee-dashboard');
    if (!employeeDashboard.classList.contains('hidden')) {
        loadEmployeeDashboard();
    }
});

adminLink.addEventListener('click', function(e) {
    e.preventDefault();
    showSection(adminSection);
    updateActiveLink(adminLink);
});

function showSection(section) {
    // Hide all sections
    clientSection.classList.add('hidden');
    clientSection.classList.remove('section-active');
    employeeSection.classList.add('hidden');
    employeeSection.classList.remove('section-active');
    adminSection.classList.add('hidden');
    adminSection.classList.remove('section-active');

    // Show selected section
    section.classList.remove('hidden');
    section.classList.add('section-active');
}

function updateActiveLink(link) {
    // Remove active class from all links
    clientLink.classList.remove('active');
    employeeLink.classList.remove('active');
    adminLink.classList.remove('active');

    // Add active class to selected link
    link.classList.add('active');
}

// Client Authentication
const clientLoginForm = document.getElementById('client-login-form');
const clientDashboard = document.getElementById('client-dashboard');

clientLoginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const clientId = document.getElementById('client-id').value;
    const clientEmail = document.getElementById('client-email').value;
    
    // Find client in cached data
    const client = cachedData.clients.find(c => c.id === clientId && c.email === clientEmail);
    
    if (client) {
        // Display client info
        document.getElementById('client-name').textContent = client.nom;
        document.getElementById('client-number').textContent = client.numero;
        document.getElementById('client-email-display').textContent = client.email;
        
        // Show client dashboard
        clientLoginForm.parentElement.classList.add('hidden');
        clientDashboard.classList.remove('hidden');
        
        // Load client accounts
        loadClientAccounts(clientId);
    } else {
        alert('Client non trouvé. Veuillez vérifier vos informations.');
    }
});

function loadClientAccounts(clientId) {
    const accountsList = document.getElementById('accounts-list');
    const accountSelect = document.getElementById('account-select');
    
    console.log('Loading accounts for client:', clientId);
    console.log('All available accounts:', cachedData.accounts);
    
    // Clear previous content
    accountsList.innerHTML = '';
    accountSelect.innerHTML = '';
    
    // Find client accounts - try multiple ways to match client IDs
    let clientAccounts = cachedData.accounts.filter(a => 
        a.clientId === clientId || 
        a.clientId?.toLowerCase() === clientId?.toLowerCase()
    );
    
    console.log('Found client accounts:', clientAccounts);
    
    // If no accounts found, use a fallback (first account) for demo purposes
    if (clientAccounts.length === 0 && cachedData.accounts.length > 0) {
        console.log('No accounts found for client, using fallback');
        clientAccounts = [cachedData.accounts[0]];
    }
    
    // Create a default option for the dropdown
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Sélectionnez un compte';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    accountSelect.appendChild(defaultOption);
    
    // Display accounts
    clientAccounts.forEach(account => {
        // Create account card
        const accountCard = document.createElement('div');
        accountCard.classList.add('account-card');
        
        const accountType = account.type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne';
        
        accountCard.innerHTML = `
            <h4>${accountType} (${account.id})</h4>
            <p>Solde: ${account.solde.toFixed(2)} €</p>
            ${account.type === 'EPARGNE' ? `<p>Taux d'intérêt: ${(account.tauxInteret * 100).toFixed(2)}%</p>` : ''}
        `;
        
        accountsList.appendChild(accountCard);
        
        // Add to select dropdown
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = `${accountType} (${account.id}) - Solde: ${account.solde.toFixed(2)} €`;
        accountSelect.appendChild(option);
    });
    
    // Alert if no accounts found
    if (clientAccounts.length === 0) {
        alert('Aucun compte disponible pour ce client. Veuillez contacter un employé pour créer un compte.');
    }
}

// Transaction Form
const transactionForm = document.getElementById('transaction-form');

transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const accountId = document.getElementById('account-select').value;
    const transactionType = document.getElementById('transaction-type').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    
    // Find account
    const accountIndex = cachedData.accounts.findIndex(a => a.id === accountId);
    
    if (accountIndex !== -1) {
        const account = cachedData.accounts[accountIndex];
        
        // Find the client that owns this account
        const accountClientId = account.clientId;
        const client = cachedData.clients.find(c => c.id === accountClientId);
        
        // Create transaction
        const transaction = {
            id: `T${cachedData.transactions.length + 1}`.padStart(4, '0'),
            accountId: accountId,
            type: transactionType,
            amount: amount,
            date: new Date().toISOString()
        };
        
        // Process transaction
        if (transactionType === 'DEPOT') {
            // Update account balance
            account.solde += amount;
            cachedData.accounts[accountIndex] = account; // Make sure the cache is updated
            
            // Create transaction with montant property (for consistency with API)
            transaction.montant = amount;
            transaction.validated = true; // Mark as validated
            
            // Add to cached transactions
            cachedData.transactions.push(transaction);
            
            console.log(`Dépôt processed: ${amount.toFixed(2)} € to account ${accountId}. New balance: ${account.solde.toFixed(2)} €`);
            alert(`Dépôt de ${amount.toFixed(2)} € effectué avec succès. Nouveau solde: ${account.solde.toFixed(2)} €`);
            
            // Refresh the account display if we're in client view
            if (client && !clientDashboard.classList.contains('hidden')) {
                loadClientAccounts(accountClientId);
            }
        } else if (transactionType === 'RETRAIT') {
            if (account.solde >= amount || (account.type === 'COURANT' && account.solde - amount >= -500)) {
                // Update account balance
                account.solde -= amount;
                cachedData.accounts[accountIndex] = account; // Make sure the cache is updated
                
                // Create transaction with montant property (for consistency with API)
                transaction.montant = amount;
                transaction.validated = true; // Mark as validated
                
                // Add to cached transactions
                cachedData.transactions.push(transaction);
                
                console.log(`Retrait processed: ${amount.toFixed(2)} € from account ${accountId}. New balance: ${account.solde.toFixed(2)} €`);
                alert(`Retrait de ${amount.toFixed(2)} € effectué avec succès. Nouveau solde: ${account.solde.toFixed(2)} €`);
                
                // Refresh the account display if we're in client view
                if (client && !clientDashboard.classList.contains('hidden')) {
                    loadClientAccounts(accountClientId);
                }
            } else {
                alert('Solde insuffisant pour effectuer ce retrait.');
            }
        }
        
        // Update accounts display
        const clientId = document.getElementById('client-id').value;
        loadClientAccounts(clientId);
    }
});

// Employee Authentication
const employeeLoginForm = document.getElementById('employee-login-form');
const employeeDashboard = document.getElementById('employee-dashboard');

employeeLoginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('employee-id').value;
    
    if (!employeeId) {
        alert('Veuillez entrer votre identifiant d\'employé.');
        return;
    }
    
    // Find employee in cached data
    const employee = cachedData.employees.find(e => e.id === employeeId);
    
    if (employee) {
        // Check if employee is active (not disabled by admin)
        if (employee.active === false) {
            alert('Votre compte employé a été désactivé. Veuillez contacter l\'administrateur.');
            return;
        }
        
        // Display welcome message with employee name
        console.log(`Employee ${employee.nom} (${employee.id}) logging in...`);
        
        // Refresh client data to ensure we have the latest
        try {
            // In a real app, we would fetch fresh data from the server here
            // For this demo, we'll use the cached data
            console.log(`Current clients available to employee ${employee.nom}:`, cachedData.clients.length);
            
            // Log employee permissions
            console.log('Employee permissions:', employee.permissions || ['all']);
        } catch (error) {
            console.error('Error refreshing client data:', error);
        }
        
        // Show employee dashboard
        employeeLoginForm.parentElement.classList.add('hidden');
        employeeDashboard.classList.remove('hidden');
        
        // Update employee name in dashboard
        const employeeNameDisplay = document.querySelector('#employee-dashboard h3');
        if (employeeNameDisplay) {
            employeeNameDisplay.textContent = `Tableau de Bord - ${employee.nom}`;
        }
        
        // Load employee dashboard with fresh data
        loadEmployeeDashboard();
        
        // Update client dropdowns
        updateClientDropdowns();
    } else {
        alert('Employé non trouvé. Veuillez vérifier vos informations ou contacter l\'administrateur pour créer un compte.');
    }
});

// Create Account Form
const createAccountForm = document.getElementById('create-account-form');

createAccountForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const clientId = document.getElementById('client-id-input').value;
    const accountType = document.getElementById('account-type').value;
    const initialBalance = parseFloat(document.getElementById('initial-balance').value);
    
    // Validate client selection
    if (!clientId || clientId === "default") {
        alert('Veuillez sélectionner un client.');
        return;
    }
    
    // Validate account type
    if (!accountType) {
        alert('Veuillez sélectionner un type de compte.');
        return;
    }
    
    // Validate initial balance
    if (isNaN(initialBalance) || initialBalance < 0) {
        alert('Veuillez entrer un solde initial valide (nombre positif).');
        return;
    }
    
    console.log(`Creating account for client: ${clientId}, Type: ${accountType}, Initial balance: ${initialBalance}`);
    
    // Find client from cached data to confirm it exists
    const client = cachedData.clients.find(c => c.id === clientId);
    
    if (!client) {
        alert('Client non trouvé. Veuillez sélectionner un client valide.');
        return;
    }
    
    // Get current employee ID from the employee dashboard
    // In a real app, this would be stored in a session
    const employeeId = document.getElementById('employee-id').value;
    const employee = cachedData.employees.find(e => e.id === employeeId);
    
    if (!employee) {
        alert('Erreur: Employé non trouvé. Veuillez vous reconnecter.');
        return;
    }
    
    // Log relationship for audit purposes
    console.log(`Employee ${employee.nom} (${employeeId}) creating account for client ${client.nom} (${clientId})`);
    console.log(`Client was created by: ${client.createdBy || 'unknown'}`);
    
    // Check if client is active
    if (client.active === false) {
        alert(`Le client ${client.nom} est désactivé. Impossible de créer un compte.`);
        return;
    }
    
    try {
        const result = await API.createAccount(clientId, accountType, initialBalance);
        
        if (result && result.success) {
            // Refresh accounts data
            try {
                cachedData.accounts = await API.getAccounts();
                console.log('Updated accounts after creation:', cachedData.accounts);
            } catch (err) {
                console.error('Failed to refresh accounts after creation:', err);
                // Continue anyway - we'll use client-side fallback
            }
            
            alert(`Compte ${accountType === 'COURANT' ? 'Courant' : 'Épargne'} créé avec succès pour ${client.nom} (ID: ${result.id}).`);
            createAccountForm.reset();
            
            // Reset form to default state
            const firstOption = document.getElementById('client-id-input').options[0];
            if (firstOption) {
                firstOption.selected = true;
            }
        } else {
            alert('Erreur lors de la création du compte: ' + (result && result.error ? result.error : 'Erreur inconnue'));
        }
    } catch (error) {
        console.error('Error creating account:', error);
        
        // Fallback to client-side account creation if API fails
        // Generate account ID
        const accountId = accountType === 'COURANT' ? 
            `CC${(cachedData.accounts.filter(a => a.type === 'COURANT').length + 1).toString().padStart(2, '0')}` : 
            `CE${(cachedData.accounts.filter(a => a.type === 'EPARGNE').length + 1).toString().padStart(2, '0')}`;
        
        // Create account
        const newAccount = {
            id: accountId,
            type: accountType,
            clientId: clientId,
            solde: initialBalance
        };
        
        // Add interest rate for savings account
        if (accountType === 'EPARGNE') {
            newAccount.tauxInteret = 0.03; // Default interest rate
        }
        
        // Add to cached data
        cachedData.accounts.push(newAccount);
        
        console.log(`Created account offline: ${accountId} for client ${clientId}`);
        alert(`Compte ${accountType === 'COURANT' ? 'Courant' : 'Épargne'} créé avec succès pour ${client.nom} (ID: ${accountId}).`);
        createAccountForm.reset();
        
        // Reset form to default state
        const firstOption = document.getElementById('client-id-input').options[0];
        if (firstOption) {
            firstOption.selected = true;
        }
    }
});

// Validate Transaction Form
const validateTransactionForm = document.getElementById('validate-transaction-form');

validateTransactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const transactionId = document.getElementById('transaction-id').value;
    
    // Find transaction
    const transaction = cachedData.transactions.find(t => t.id === transactionId);
    
    if (transaction) {
        alert(`Transaction ${transactionId} validée avec succès.`);
        validateTransactionForm.reset();
    } else {
        alert('Transaction non trouvée. Veuillez vérifier l\'ID de transaction.');
    }
});

// Admin Authentication
const adminLoginForm = document.getElementById('admin-login-form');
const adminDashboard = document.getElementById('admin-dashboard');

adminLoginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const adminId = document.getElementById('admin-id').value;
    const adminName = document.getElementById('admin-name').value;
    
    // Find admin in cached data
    const admin = cachedData.admins.find(a => a.id === adminId && a.nom === adminName);
    
    if (admin) {
        // Show admin dashboard
        adminLoginForm.parentElement.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
    } else {
        alert('Admin non trouvé. Veuillez vérifier vos informations.');
    }
});

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Get the tab content to show
        const tabId = this.getAttribute('data-tab');
        const tabContent = document.getElementById(tabId);
        
        // Hide all tab contents in the same container
        const tabsContainer = this.closest('.tabs').parentElement;
        tabsContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all buttons in the same tab group
        this.closest('.tabs').querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show the selected tab content and mark the button as active
        tabContent.classList.add('active');
        this.classList.add('active');
    });
});

// Admin features - User management
function loadAdminDashboard() {
    // Update statistics
    document.getElementById('client-count').textContent = cachedData.clients.length;
    document.getElementById('account-count').textContent = cachedData.accounts.length;
    document.getElementById('transaction-count').textContent = cachedData.transactions.length;
    
    // Load clients list
    const clientsList = document.getElementById('clients-list');
    clientsList.innerHTML = '';
    
    cachedData.clients.forEach(client => {
        const clientCard = document.createElement('div');
        clientCard.classList.add('user-card');
        
        clientCard.innerHTML = `
            <div class="user-info">
                <strong>${client.nom}</strong> (ID: ${client.id})<br>
                <small>${client.email} | ${client.numero}</small>
            </div>
            <div class="user-actions">
                <button class="edit-btn" data-id="${client.id}">Modifier</button>
                <button class="delete-btn" data-id="${client.id}">Supprimer</button>
            </div>
        `;
        
        clientsList.appendChild(clientCard);
    });
    
    // Load employees list
    const employeesList = document.getElementById('employees-list');
    employeesList.innerHTML = '';
    
    cachedData.employees.forEach(employee => {
        const employeeCard = document.createElement('div');
        employeeCard.classList.add('user-card');
        
        employeeCard.innerHTML = `
            <div class="user-info">
                <strong>${employee.nom}</strong> (ID: ${employee.id})
            </div>
            <div class="user-actions">
                <button class="edit-btn" data-id="${employee.id}">Modifier</button>
                <button class="delete-btn" data-id="${employee.id}">Supprimer</button>
            </div>
        `;
        
        employeesList.appendChild(employeeCard);
    });
    
    // Add client form event listener
    document.getElementById('add-client-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newClientId = document.getElementById('new-client-id').value;
        const newClientName = document.getElementById('new-client-name').value;
        const newClientNumber = document.getElementById('new-client-number').value;
        const newClientEmail = document.getElementById('new-client-email').value;
        
        // Validate input
        if (!newClientId || !newClientName || !newClientNumber || !newClientEmail) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        
        // Check if client ID already exists
        if (cachedData.clients.some(c => c.id === newClientId)) {
            alert('Un client avec cet ID existe déjà.');
            return;
        }
        
        // Check if email is valid
        if (!newClientEmail.includes('@')) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }
        
        // Add new client to cached data with additional metadata for linking
        // Using idClient to match the Java backend's field name
        const newClient = {
            id: newClientId,          // Keep id for backward compatibility
            idClient: newClientId,    // Add idClient to match Java's Client.getIdClient() method
            nom: newClientName,
            numero: newClientNumber,
            email: newClientEmail,
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            active: true
        };
        
        // Add to global data cache
        cachedData.clients.push(newClient);
        
        // Log for debugging
        console.log('New client added by admin:', newClient);
        
        // Refresh admin dashboard
        loadAdminDashboard();
        
        // Also refresh employee dashboard data for when they switch to that view
        // This ensures the new client appears in the employee client list
        loadEmployeeDashboard();
        
        // Refresh client dropdowns in employee account creation form
        updateClientDropdowns();
        
        alert(`Client ${newClientName} ajouté avec succès. Les employés peuvent maintenant créer des comptes pour ce client.`);
        this.reset();
    });
    
    // Add employee form event listener
    document.getElementById('add-employee-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newEmployeeId = document.getElementById('new-employee-id').value;
        const newEmployeeName = document.getElementById('new-employee-name').value;
        
        // Validate input
        if (!newEmployeeId || !newEmployeeName) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        
        // Check if employee ID already exists
        if (cachedData.employees.some(e => e.id === newEmployeeId)) {
            alert('Un employé avec cet ID existe déjà.');
            return;
        }
        
        // Add new employee to cached data with additional metadata for linking
        const newEmployee = {
            id: newEmployeeId,
            nom: newEmployeeName,
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            active: true,
            permissions: ['create_account', 'view_client', 'block_account'] // Default permissions
        };
        
        // Add to global data cache
        cachedData.employees.push(newEmployee);
        
        // Log for debugging
        console.log('New employee added by admin:', newEmployee);
        
        // Refresh employees list
        loadAdminDashboard();
        
        alert(`Employé ${newEmployeeName} ajouté avec succès. L'employé peut maintenant se connecter et gérer les comptes clients.`);
        this.reset();
    });
    
    // Setup edit and delete button handlers
    setupUserActionButtons();
}

function setupUserActionButtons() {
    // Edit client buttons
    document.querySelectorAll('#clients-list .edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-id');
            const client = cachedData.clients.find(c => c.id === clientId);
            
            if (client) {
                const newName = prompt('Nom du client:', client.nom);
                const newNumber = prompt('Numéro du client:', client.numero);
                const newEmail = prompt('Email du client:', client.email);
                
                if (newName && newNumber && newEmail) {
                    client.nom = newName;
                    client.numero = newNumber;
                    client.email = newEmail;
                    
                    loadAdminDashboard();
                    alert('Client modifié avec succès.');
                }
            }
        });
    });
    
    // Delete client buttons
    document.querySelectorAll('#clients-list .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-id');
            
            if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${clientId}?`)) {
                // Check if client has accounts
                if (cachedData.accounts.some(a => a.clientId === clientId)) {
                    alert('Impossible de supprimer ce client car il possède des comptes.');
                    return;
                }
                
                // Remove client from cached data
                cachedData.clients = cachedData.clients.filter(c => c.id !== clientId);
                
                loadAdminDashboard();
                alert('Client supprimé avec succès.');
            }
        });
    });
    
    // Edit employee buttons
    document.querySelectorAll('#employees-list .edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const employeeId = this.getAttribute('data-id');
            const employee = cachedData.employees.find(e => e.id === employeeId);
            
            if (employee) {
                const newName = prompt('Nom de l\'employé:', employee.nom);
                
                if (newName) {
                    employee.nom = newName;
                    
                    loadAdminDashboard();
                    alert('Employé modifié avec succès.');
                }
            }
        });
    });
    
    // Delete employee buttons
    document.querySelectorAll('#employees-list .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const employeeId = this.getAttribute('data-id');
            
            if (confirm(`Êtes-vous sûr de vouloir supprimer l'employé ${employeeId}?`)) {
                // Remove employee from cached data
                cachedData.employees = cachedData.employees.filter(e => e.id !== employeeId);
                
                loadAdminDashboard();
                alert('Employé supprimé avec succès.');
            }
        });
    });
}

// Helper function to update all client dropdowns in the application
function updateClientDropdowns() {
    const clientDropdown = document.getElementById('client-id-input');
    if (clientDropdown) {
        // Clear dropdown except for the first option
        while (clientDropdown.options.length > 1) {
            clientDropdown.remove(1);
        }
        
        // Make sure the default option is not selectable
        clientDropdown.options[0].value = "default";
        
        // Check if we have any clients
        if (cachedData.clients.length === 0) {
            console.log('No clients available for dropdown');
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Aucun client disponible - veuillez créer des clients via l'admin";
            option.disabled = true;
            clientDropdown.appendChild(option);
        } else {
            // Add clients to dropdown
            cachedData.clients.forEach(client => {
                const option = document.createElement('option');
                // Ensure we use the exact field that matches the Java Client.getIdClient() method
                // In the Java class, it's idClient, but in the JSON it might be coming as 'id'
                const clientId = client.idClient || client.id;
                option.value = clientId;
                option.textContent = `${client.nom} (ID: ${clientId}) - ${client.email}`;
                clientDropdown.appendChild(option);
                console.log(`Added client to dropdown: ID=${clientId}, Name=${client.nom}`);
            });
            
            console.log('Client dropdowns updated with latest client data');
        }
    }
}

// Enhanced employee features
function loadEmployeeDashboard() {
    // Populate client dropdown for account creation
    updateClientDropdowns();
    
    // Load client list for the employee
    const employeeClientsList = document.getElementById('employee-clients-list');
    employeeClientsList.innerHTML = '';
    
    cachedData.clients.forEach(client => {
        const clientCard = document.createElement('div');
        clientCard.classList.add('user-card');
        
        clientCard.innerHTML = `
            <div class="user-info">
                <strong>${client.nom}</strong> (ID: ${client.id})<br>
                <small>${client.email} | ${client.numero}</small>
            </div>
            <div class="user-actions">
                <button class="view-btn" data-id="${client.id}">Détails</button>
            </div>
        `;
        
        employeeClientsList.appendChild(clientCard);
    });
    
    // Set up view client buttons
    document.querySelectorAll('#employee-clients-list .view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-id');
            document.getElementById('client-details-id').value = clientId;
            document.getElementById('get-client-details-btn').click();
        });
    });
    
    // Set up client details button
    document.getElementById('get-client-details-btn').addEventListener('click', function() {
        const clientId = document.getElementById('client-details-id').value;
        const client = cachedData.clients.find(c => c.id === clientId);
        
        if (client) {
            // Display client info
            document.getElementById('detail-client-name').textContent = client.nom;
            document.getElementById('detail-client-number').textContent = client.numero;
            document.getElementById('detail-client-email').textContent = client.email;
            
            // Show client details section
            document.getElementById('client-details').classList.remove('hidden');
            
            // Load client accounts
            const clientAccounts = cachedData.accounts.filter(a => a.clientId === clientId);
            const accountsContainer = document.getElementById('detail-client-accounts');
            accountsContainer.innerHTML = '';
            
            if (clientAccounts.length > 0) {
                clientAccounts.forEach(account => {
                    const accountCard = document.createElement('div');
                    accountCard.classList.add('account-card');
                    
                    const accountType = account.type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne';
                    
                    // Set default blocked status if not present
                    if (account.blocked === undefined) account.blocked = false;
                    
                    const statusClass = account.blocked ? 'account-blocked' : 'account-active';
                    const blockBtnText = account.blocked ? 'Débloquer' : 'Bloquer';
                    
                    accountCard.innerHTML = `
                        <h4>${accountType} (${account.id})</h4>
                        <p>Solde: ${account.solde.toFixed(2)} €</p>
                        ${account.type === 'EPARGNE' ? `<p>Taux d'intérêt: ${(account.tauxInteret * 100).toFixed(2)}%</p>` : ''}
                        <p>Statut: <span class="${statusClass}">${account.blocked ? 'BLOQUÉ' : 'ACTIF'}</span></p>
                        <div class="account-actions">
                            <button class="manage-account-btn" data-id="${account.id}">Gérer</button>
                            <button class="block-account-btn ${statusClass}" data-id="${account.id}" data-blocked="${account.blocked}">${blockBtnText}</button>
                        </div>
                    `;
                    
                    accountsContainer.appendChild(accountCard);
                });
                
                // Set up block/unblock account buttons
                document.querySelectorAll('.block-account-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const accountId = this.getAttribute('data-id');
                        const isCurrentlyBlocked = this.getAttribute('data-blocked') === 'true';
                        
                        // Find account in cached data
                        const accountIndex = cachedData.accounts.findIndex(a => a.id === accountId);
                        
                        if (accountIndex !== -1) {
                            // Toggle blocked status
                            cachedData.accounts[accountIndex].blocked = !isCurrentlyBlocked;
                            
                            const account = cachedData.accounts[accountIndex];
                            const statusText = account.blocked ? 'bloqué' : 'débloqué';
                            
                            alert(`Compte ${accountId} ${statusText} avec succès.`);
                            
                            // Refresh client details to show updated status
                            document.getElementById('get-client-details-btn').click();
                        }
                    });
                });
                
                // Load client transactions
                loadClientTransactions(clientAccounts.map(a => a.id));
            } else {
                accountsContainer.innerHTML = '<p>Aucun compte trouvé pour ce client.</p>';
                document.getElementById('client-transactions-list').innerHTML = 
                    '<tr><td colspan="6">Aucune transaction trouvée pour ce client.</td></tr>';
            }
        } else {
            alert('Client non trouvé.');
            document.getElementById('client-details').classList.add('hidden');
        }
    });
    
    // Function to load client transactions
    function loadClientTransactions(accountIds) {
        const transactionsList = document.getElementById('client-transactions-list');
        transactionsList.innerHTML = '';
        
        // Filter transactions for these accounts and sort by date (newest first)
        const clientTransactions = cachedData.transactions
            .filter(t => accountIds.includes(t.accountId))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (clientTransactions.length > 0) {
            clientTransactions.forEach(transaction => {
                const tr = document.createElement('tr');
                
                // Find account info
                const account = cachedData.accounts.find(a => a.id === transaction.accountId);
                const accountType = account ? (account.type === 'COURANT' ? 'Courant' : 'Épargne') : '?';
                
                // Format date
                const date = new Date(transaction.date);
                const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                
                // Format transaction type
                const transactionType = transaction.type === 'DEPOT' ? 'Dépôt' : 'Retrait';
                
                // Format amount with + or - prefix
                const amountPrefix = transaction.type === 'DEPOT' ? '+' : '-';
                
                tr.innerHTML = `
                    <td>${transaction.id}</td>
                    <td>${account ? account.id : '?'} (${accountType})</td>
                    <td>${transactionType}</td>
                    <td class="${transaction.type === 'DEPOT' ? 'positive' : 'negative'}">
                        ${amountPrefix}${transaction.montant.toFixed(2)} €
                    </td>
                    <td>${formattedDate}</td>
                    <td>${transaction.validated ? 'Validée' : 'En attente'}</td>
                `;
                
                transactionsList.appendChild(tr);
            });
        } else {
            transactionsList.innerHTML = '<tr><td colspan="6">Aucune transaction trouvée pour ce client.</td></tr>';
        }
    }
    
    // Load transactions list
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...cachedData.transactions].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedTransactions.forEach(transaction => {
        const tr = document.createElement('tr');
        
        // Find account info
        const account = cachedData.accounts.find(a => a.id === transaction.accountId);
        const accountType = account ? (account.type === 'COURANT' ? 'Courant' : 'Épargne') : '?';
        
        // Format date
        const date = new Date(transaction.date);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        tr.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.accountId} (${accountType})</td>
            <td>${transaction.type === 'DEPOT' ? 'Dépôt' : 'Retrait'}</td>
            <td>${transaction.amount.toFixed(2)} €</td>
            <td>${formattedDate}</td>
            <td>
                <button class="validate-btn" data-id="${transaction.id}">Valider</button>
            </td>
        `;
        
        transactionsList.appendChild(tr);
    });
    
    // Set up validate transaction buttons in the table
    document.querySelectorAll('.validate-btn').forEach(button => {
        button.addEventListener('click', function() {
            const transactionId = this.getAttribute('data-id');
            document.getElementById('transaction-id').value = transactionId;
            document.getElementById('validate-transaction-form').dispatchEvent(new Event('submit'));
        });
    });
    
    // Set up search account functionality
    document.getElementById('search-account-btn').addEventListener('click', function() {
        const accountId = document.getElementById('search-account').value.trim();
        
        if (accountId) {
            const account = cachedData.accounts.find(a => a.id === accountId);
            const accountsList = document.getElementById('employee-accounts-list');
            
            if (account) {
                // Find client
                const client = cachedData.clients.find(c => c.id === account.clientId);
                
                // Display account details
                accountsList.innerHTML = '';
                
                const accountCard = document.createElement('div');
                accountCard.classList.add('account-card');
                
                const accountType = account.type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne';
                
                accountCard.innerHTML = `
                    <h4>${accountType} (${account.id})</h4>
                    <p>Client: ${client ? client.nom : 'Inconnu'} (${account.clientId})</p>
                    <p>Solde: ${account.solde.toFixed(2)} €</p>
                    ${account.type === 'EPARGNE' ? `<p>Taux d'intérêt: ${(account.tauxInteret * 100).toFixed(2)}%</p>` : ''}
                    <div class="account-actions">
                        <button class="block-account-btn" data-id="${account.id}">Bloquer le compte</button>
                        ${account.type === 'EPARGNE' ? `<button class="apply-interest-btn" data-id="${account.id}">Appliquer les intérêts</button>` : ''}
                    </div>
                `;
                
                accountsList.appendChild(accountCard);
                
                // Set up block account button
                accountsList.querySelector('.block-account-btn').addEventListener('click', function() {
                    if (confirm(`Êtes-vous sûr de vouloir bloquer le compte ${account.id}?`)) {
                        alert(`Compte ${account.id} bloqué avec succès.`);
                    }
                });
                
                // Set up apply interest button for savings accounts
                if (account.type === 'EPARGNE') {
                    accountsList.querySelector('.apply-interest-btn').addEventListener('click', function() {
                        const interestAmount = account.solde * account.tauxInteret;
                        account.solde += interestAmount;
                        
                        // Refresh the account display
                        document.getElementById('search-account-btn').click();
                        
                        alert(`Intérêts de ${interestAmount.toFixed(2)} € appliqués au compte ${account.id}.`);
                    });
                }
            } else {
                accountsList.innerHTML = '<p>Aucun compte trouvé avec cet ID.</p>';
            }
        } else {
            alert('Veuillez entrer un ID de compte.');
        }
    });
}

// Update admin login to load admin dashboard
adminLoginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const adminId = document.getElementById('admin-id').value;
    const adminName = document.getElementById('admin-name').value;
    
    // Find admin in cached data
    const admin = cachedData.admins.find(a => a.id === adminId && a.nom === adminName);
    
    if (admin) {
        // Show admin dashboard
        adminLoginForm.parentElement.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        
        // Load admin dashboard data
        loadAdminDashboard();
    } else {
        alert('Admin non trouvé. Veuillez vérifier vos informations.');
    }
});

// Update employee login to load employee dashboard
employeeLoginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('employee-id').value;
    const employeeName = document.getElementById('employee-name').value;
    
    // Find employee in cached data
    const employee = cachedData.employees.find(e => e.id === employeeId && e.nom === employeeName);
    
    if (employee) {
        // Show employee dashboard
        employeeLoginForm.parentElement.classList.add('hidden');
        employeeDashboard.classList.remove('hidden');
        
        // Load employee dashboard data
        loadEmployeeDashboard();
    } else {
        alert('Employé non trouvé. Veuillez vérifier vos informations.');
    }
});
