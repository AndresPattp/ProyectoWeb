// Estructura de datos para las categorías y juegos
const categories = [
  { 
    id: 'accion', 
    name: 'Acción', 
    image: 'images/categories/action.jpg', // Ruta a la imagen de la categoría
    games: [
      { 
        name: 'Action Hero', 
        price: 49.99,
        image: 'images/games/action-hero.jpg' // Ruta a la imagen del juego
      },
      { 
        name: 'Battle Squad', 
        price: 59.99,
        image: 'images/games/battle-squad.jpg'
      }
    ]
  },
  { 
    id: 'aventura', 
    name: 'Aventura', 
    image: 'images/categories/adventure.jpg',
    games: [
      { 
        name: 'Forest Explorer', 
        price: 39.99,
        image: '/images/games/forest-explorer.jpg'
      },
      { 
        name: 'Mystic Island', 
        price: 45.99,
        image: '/images/games/mystic-island.jpg'
      }
    ]
  },
  { 
    id: 'estrategia', 
    name: 'Estrategia', 
    image: '/images/categories/strategy.jpg',
    games: [
      { 
        name: 'Kingdom Builder', 
        price: 29.99,
        image: '/images/games/kingdom-builder.jpg'
      },
      { 
        name: 'War Tactics', 
        price: 34.99,
        image: '/images/games/war-tactics.jpg'
      }
    ]
  },
  { 
    id: 'deportes', 
    name: 'Deportes', 
    image: '/images/categories/sports.jpg',
    games: [
      { 
        name: 'Soccer Pro', 
        price: 19.99,
        image: '/images/games/soccer-pro.jpg'
      },
      { 
        name: 'Basketball Stars', 
        price: 24.99,
        image: '/images/games/basketball-stars.jpg'
      }
    ]
  }
];

// Estado global de la aplicación
const state = {
  isCartOpen: false,
  cartCount: 0,
  selectedCategory: null,
  cart: []
};

// Funciones de utilidad para manipular el DOM
function createCategoryCard(category) {
  return `
      <div 
          class="category-card flex-none w-72 h-96 relative rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300"
          data-category-id="${category.id}"
      >
          <img
              src="${category.image}"
              alt="${category.name}"
              class="w-full h-full object-cover transition-transform duration-300"
              onerror="this.src='/images/placeholder.jpg'" // Imagen de respaldo si la principal falla
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <span class="absolute bottom-6 left-6 bg-black/70 text-white px-6 py-2 rounded-full font-bold">
              ${category.name}
          </span>
      </div>
  `;
}

// Función actualizada para crear tarjetas de juegos
function createGameCard(game) {
  return `
      <div class="game-card bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105">
          <img
              src="${game.image}"
              alt="${game.name}"
              class="w-full h-48 object-cover"
              onerror="this.src='/images/game-placeholder.jpg'" // Imagen de respaldo si la principal falla
          />
          <div class="p-4">
              <h3 class="font-bold text-lg mb-2">${game.name}</h3>
              <p class="text-blue-600 font-bold text-xl">$${game.price}</p>
              <button 
                  class="add-to-cart w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  data-game-name="${game.name}"
                  data-game-price="${game.price}"
              >
                  Añadir al carrito
              </button>
          </div>
      </div>
  `;
}

function updateCartPanel() {
  const cartItems = document.querySelector('.cart-items');
  
  if (!cartItems) return;

  if (state.cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-500 text-center mt-8">Tu carrito está vacío</p>';
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartItems.innerHTML = `
      ${state.cart.map(item => `
          <div class="cart-item flex justify-between items-center p-4 border-b">
              <div>
                  <h3 class="font-bold">${item.name} (x${item.quantity})</h3>
                  <p class="text-blue-600">$${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button 
                  class="remove-from-cart text-red-500"
                  data-game-id="${item.id}"
              >
                  Eliminar
              </button>
          </div>
      `).join('')}
      <div class="mt-4 p-4 border-t">
          <p class="text-xl font-bold">Total: $${total.toFixed(2)}</p>
      </div>
  `;
}

function updateCartCount() {
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
      cartCountElement.textContent = state.cartCount;
  }
}

// Funciones principales
function toggleCart() {
  state.isCartOpen = !state.isCartOpen;
  const cartPanel = document.querySelector('.cart-panel');
  if (cartPanel) {
      cartPanel.classList.toggle('hidden', !state.isCartOpen);
  }
}

function addToCart(game) {
  const existingItem = state.cart.find(item => item.id === game.id);
  
  if (existingItem) {
    existingItem.quantity += 1; // Incrementar cantidad si ya existe
  } else {
    state.cart.push({ ...game, quantity: 1 }); // Agregar nuevo juego con cantidad inicial
  }
  
  state.cartCount = state.cart.length;
  updateCartPanel();
  updateCartCount();
}

function removeFromCart(gameId) {
  const index = state.cart.findIndex(item => item.id === gameId);
  
  if (index !== -1) {
    state.cart.splice(index, 1);
    state.cartCount = state.cart.length;
    updateCartPanel();
    updateCartCount();
  }
}

function selectCategory(categoryId) {
  const previouslySelected = document.querySelector('.category-card.selected');
  if (previouslySelected) {
      previouslySelected.classList.remove('selected'); // Remover la clase de selección
  }

  state.selectedCategory = state.selectedCategory === categoryId ? null : categoryId;
  const selectedCategory = categories.find(c => c.id === state.selectedCategory);
  
  const categoriesContainer = document.querySelector('.categories-carousel');
  if (!categoriesContainer) return;

  // Agregar clase 'selected' a la categoría seleccionada
  const currentCategoryCard = categoriesContainer.querySelector(`[data-category-id="${categoryId}"]`);
  if (currentCategoryCard) {
      currentCategoryCard.classList.add('selected');
  }

  const gamesContainer = document.querySelector('.games-container');
  if (!gamesContainer) return;

  if (!selectedCategory) {
      gamesContainer.innerHTML = ''; // Limpiar si no hay categoría seleccionada
      return;
  }

  // Mostrar juegos con un efecto de desplazamiento
  gamesContainer.innerHTML = `
      <h2 class="text-3xl font-bold mb-8">Juegos de ${selectedCategory.name}</h2>
      <div class="games-container">
          ${selectedCategory.games.map(game => createGameCard(game)).join('')}
      </div>
  `;
}

// Inicialización y event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Renderizar categorías
  const categoriesContainer = document.querySelector('.categories-carousel');
  if (categoriesContainer) {
      categoriesContainer.innerHTML = categories.map(category => createCategoryCard(category)).join('');
  }

  // Event listeners para categorías
  document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
          selectCategory(card.dataset.categoryId);
      });
  });

  // Event listener para el carrito
  document.querySelector('.cart-toggle')?.addEventListener('click', toggleCart);

  // Event delegation para botones de añadir/eliminar del carrito
  document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
          const { gameName, gamePrice } = e.target.dataset;
          addToCart(gameName, parseFloat(gamePrice));
      }
      
      if (e.target.classList.contains('remove-from-cart')) {
          removeFromCart(e.target.dataset.gameName);
      }
  });
});

function updateCartItem(gameId, quantity) {
  const item = state.cart.find(item => item.id === gameId);
  
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(gameId); // Eliminar si la cantidad es cero o menor
    } else {
      updateCartPanel(); // Actualizar el panel del carrito
    }
  }
}