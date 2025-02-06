require 'rails_helper'

feature 'site settings: authentication', type: :system, js: true do
  let(:admin) { FactoryBot.create(:admin) }
  
  let(:o_auth) { FactoryBot.create(:o_auth) }
  let(:disabled_default_o_auth) { FactoryBot.create(:default_o_auth, is_enabled: false) }
  let(:enabled_default_o_auth) { FactoryBot.create(:default_o_auth, is_enabled: true) }

  let(:o_auths_list_selector) { '.oAuthsList' }
  let(:o_auth_list_item_selector) { '.oAuthListItem' }
  let(:o_auth_form_selector) { '.authenticationFormPage' }

  before(:each) do
    o_auth

    admin.confirm
    sign_in admin
    
    visit site_settings_authentication_path
  end

  it 'lets view existing oauths' do
    within o_auths_list_selector do
      expect(page).to have_css(o_auth_list_item_selector, count: OAuth.count)

      expect(page).to have_content(/#{o_auth.name}/i)
    end
  end

  it 'lets view existing default oauths, if enabled' do
    disabled_default_o_auth # should not be visible
    enabled_default_o_auth # should be visible

    visit site_settings_authentication_path

    within o_auths_list_selector do
      expect(page).to have_content(/#{enabled_default_o_auth.name}/i)
      expect(page).not_to have_content(/#{disabled_default_o_auth.name}/i)
    end
  end

  it 'lets create new oauths' do
    n_of_o_auths = OAuth.count
    new_o_auth_name = 'My new oauth'

    within o_auths_list_selector do
      expect(page).to have_css(o_auth_list_item_selector, count: n_of_o_auths)

      expect(page).not_to have_content(/#{new_o_auth_name}/i)
    end

    click_button 'New'

    within o_auth_form_selector do
      fill_in 'Name', with: new_o_auth_name
      fill_in 'Client ID', with: '1234567890'
      fill_in 'Client secret', with: '1234567890'
      fill_in 'Authorize URL', with: 'https://example.com/authorize'
      fill_in 'Token URL', with: 'https://example.com/token'
      fill_in 'Scope', with: 'email'
      fill_in 'Profile URL', with: 'https://example.com/profile'
      fill_in 'JSON path to user email', with: 'email'
      fill_in 'JSON path to user name', with: 'name'

      click_button 'Create'
    end

    within '.siteSettingsInfo' do
      expect(page).to have_content('All changes saved')
    end

    within o_auths_list_selector do
      expect(page).to have_css(o_auth_list_item_selector, count: n_of_o_auths + 1)

      expect(page).to have_content(/#{new_o_auth_name}/i)
    end

    expect(OAuth.count).to eq(n_of_o_auths + 1)
  end

  it 'lets edit existing oauths' do
    o_auth_to_edit = OAuth.last
    new_o_auth_name = 'My new oauth'

    expect(page).not_to have_content(/#{new_o_auth_name}/i)
    expect(o_auth_to_edit.name).not_to eq(new_o_auth_name)

    within o_auths_list_selector do
      within find(o_auth_list_item_selector, text: /#{o_auth_to_edit.name}/i) do
        find('.editAction').click
      end
    end

    within o_auth_form_selector do
      fill_in 'Name', with: new_o_auth_name

      click_button 'Save'
    end

    within '.siteSettingsInfo' do
      expect(page).to have_content('All changes saved')
    end

    expect(page).to have_content(/#{new_o_auth_name}/i)
    expect(o_auth_to_edit.reload.name).to eq(new_o_auth_name)
  end

  it 'lets delete existing oauths' do
    n_of_oauths = OAuth.count
    o_auth_to_delete = OAuth.last

    within o_auths_list_selector do
      within find(o_auth_list_item_selector, text: /#{o_auth_to_delete.name}/i) do
        find('.deleteAction').click
        page.driver.browser.switch_to.alert.accept
      end
    end

    within '.siteSettingsInfo' do
      expect(page).to have_content('All changes saved')
    end

    expect(page).not_to have_content(/#{o_auth_to_delete.name}/i)
    expect(OAuth.find_by(id: o_auth_to_delete.id)).to be_nil
    expect(OAuth.count).to eq(n_of_oauths - 1)
  end
end