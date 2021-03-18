module ApplicationHelper

  def show_resource(resource)
    if resource == User
      if current_user.role == 'admin'
        return true
      else
        return false
      end
    else
      return true
    end
  end

end
