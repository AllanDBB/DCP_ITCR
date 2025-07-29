const testAdminLogin = async () => {
    try {
        console.log('🧪 Probando login del administrador...');
        
        const baseURL = 'http://localhost:5000/api';
        
        // Intentar login
        const loginResponse = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@dcp-itcr.com',
                password: 'Admin123!'
            })
        });
        
        const loginData = await loginResponse.json();
        
        if (!loginResponse.ok) {
            throw new Error(loginData.message || 'Error en login');
        }
        
        console.log('✅ Login exitoso');
        console.log('📧 Email:', loginData.user.email);
        console.log('👤 Usuario:', loginData.user.username);
        console.log('🔐 Rol:', loginData.user.role);
        console.log('🎫 Token:', loginData.token ? 'Presente' : 'Ausente');
        
        // Probar acceso a rutas de admin
        const token = loginData.token;
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        try {
            const statsResponse = await fetch(`${baseURL}/admin/stats`, { headers });
            const statsData = await statsResponse.json();
            
            if (statsResponse.ok) {
                console.log('✅ Acceso a /admin/stats exitoso');
                console.log('📊 Estadísticas:', statsData.data);
            } else {
                console.log('❌ Error accediendo a /admin/stats:', statsData.message);
            }
        } catch (error) {
            console.log('❌ Error accediendo a /admin/stats:', error.message);
        }
        
        try {
            const datasetsResponse = await fetch(`${baseURL}/admin/datasets`, { headers });
            const datasetsData = await datasetsResponse.json();
            
            if (datasetsResponse.ok) {
                console.log('✅ Acceso a /admin/datasets exitoso');
                console.log('📊 Datasets encontrados:', datasetsData.data.datasets.length);
            } else {
                console.log('❌ Error accediendo a /admin/datasets:', datasetsData.message);
            }
        } catch (error) {
            console.log('❌ Error accediendo a /admin/datasets:', error.message);
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    testAdminLogin();
}

module.exports = { testAdminLogin }; 