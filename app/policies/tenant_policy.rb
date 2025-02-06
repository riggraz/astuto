class TenantPolicy < ApplicationPolicy
  def permitted_attributes_for_create
    [:site_name, :subdomain]
  end

  def permitted_attributes_for_update
    if user.admin?
      [:site_name, :site_logo, :old_site_logo, :site_favicon, :locale, :custom_domain]
    else
      []
    end
  end

  def create?
    true
  end

  def update?
    user.admin? and user.tenant_id == record.id
  end
end