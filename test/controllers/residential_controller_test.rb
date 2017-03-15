require 'test_helper'

class ResidentialControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get residential_index_url
    assert_response :success
  end

end
