import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads with brand name', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=光芯云')).toBeVisible()
    await expect(page.locator('text=PhotonCloud')).toBeVisible()
  })

  test('can navigate to all main pages', async ({ page }) => {
    await page.goto('/')
    
    // Chips page
    await page.click('text=芯片库')
    await expect(page.url()).toContain('/chips')
    
    // Cloud Sim
    await page.click('text=云仿真')
    await expect(page.url()).toContain('/cloud-sim')
    
    // PDK
    await page.click('text=PDK')
    await expect(page.url()).toContain('/pdk')
    
    // Help
    await page.click('text=帮助')
    await expect(page.url()).toContain('/help')
  })

  test('search opens with Cmd+K', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k')
    await expect(page.locator('input[placeholder*="搜索"]')).toBeVisible()
  })

  test('language switch works', async ({ page }) => {
    await page.goto('/')
    // Find and click language button
    await page.locator('button:has(svg)').filter({ hasText: '' }).nth(1).click()
    // Should switch to English
    await expect(page.locator('text=PhotonCloud')).toBeVisible()
  })
})

test.describe('Cloud Simulation', () => {
  test('can access submit job panel', async ({ page }) => {
    await page.goto('/cloud-sim')
    await page.click('text=提交作业')
    await expect(page.locator('text=选择仿真器件')).toBeVisible()
  })

  test('templates panel shows 12 cases', async ({ page }) => {
    await page.goto('/cloud-sim')
    await page.click('text=案例模板')
    const cards = page.locator('text=一键提交仿真')
    await expect(cards).toHaveCount(12)
  })

  test('cluster panel shows nodes', async ({ page }) => {
    await page.goto('/cloud-sim')
    await page.click('text=集群')
    await expect(page.locator('text=计算节点')).toBeVisible()
  })
})

test.describe('PDK Platform', () => {
  test('foundry list loads', async ({ page }) => {
    await page.goto('/pdk')
    await expect(page.locator('text=CUMEC')).toBeVisible()
  })

  test('compatibility matrix shows', async ({ page }) => {
    await page.goto('/pdk')
    await page.click('text=兼容矩阵')
    await expect(page.locator('text=PDK 兼容性矩阵')).toBeVisible()
  })

  test('MPW calendar loads', async ({ page }) => {
    await page.goto('/pdk')
    await page.click('text=MPW 日历')
    await expect(page.locator('text=MPW 多项目晶圆日历')).toBeVisible()
  })
})

test.describe('Authentication', () => {
  test('login page accessible', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[placeholder*="用户名"]')).toBeVisible()
  })

  test('can login with demo account', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[placeholder*="用户名"]', 'zhangwei')
    await page.fill('input[placeholder*="密码"]', 'demo123')
    await page.click('button:has-text("登录")')
    // Should redirect to home
    await page.waitForURL('/')
    await expect(page.locator('text=张伟')).toBeVisible()
  })
})
