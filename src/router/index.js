import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ModeSelectionView from '../views/ModeSelectionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/mode-selection',
      name: 'mode-selection',
      component: ModeSelectionView
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/InstitutionalView.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyPolicyView.vue')
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue')
    },
    {
      path: '/dmca',
      name: 'dmca',
      component: () => import('../views/CopyrightView.vue')
    },
    {
      path: '/stories',
      name: 'stories',
      component: () => import('../views/StoriesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('../views/StoriesView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

import { getAuth, onAuthStateChanged } from 'firebase/auth'

router.beforeEach(async (to, from, next) => {
  const auth = getAuth()

  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe()
        resolve(user)
      }, reject)
    })
  }

  const user = await getCurrentUser()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      next({
        path: '/mode-selection',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router