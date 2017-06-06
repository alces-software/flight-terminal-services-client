#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class MigrateOldTokens < ActiveRecord::Migration[5.0]
  def up
    @dynamodb = Aws::DynamoDB::Client.new

    last_evaluated_key = nil
    loop do
      legacy_tokens = load_tokens(last_evaluated_key)
      process_tokens(legacy_tokens.items)

      last_evaluated_key = legacy_tokens.last_evaluated_key
      break if last_evaluated_key.nil?
    end
  end

  def down
    Token.where(migrated: true).destroy_all
  end

  private

  # We don't migrate any tokens with the following tags.
  #
  # These tokens are awkward to migrate as they have not been restricted to a
  # specific set of cluster specs.  A correct migration would therefore make
  # them available for use with any tenant which is a bit of a pain to do.
  #
  # Instead we ignore them, which is safe as manual inspection has shown that
  # they have all been created by Alces staff, who can easily create
  # additional tokens. Furthermore, "*demo*" tokens have already been used.
  #
  TAGS_TO_IGNORE = [
    'ansys-demo-wil1',
    'ansysdemo-wil',
    'ben',
    'bens-token',
    'bens-tokens',
    'markt-manual-token',
    'ruan ansys',
    'ruan',
    'ruan-ansys-10',
    'ruan-ansys-11',
    'ruan-ansys-12',
    'ruan-ansys-2',
    'ruan-ansys-3',
    'ruan-ansys-4',
    'ruan-ansys-5',
    'ruan-ansys-6',
    'ruan-ansys-7',
    'ruan-ansys-8',
    'ruan-ansys-9',
    'sf-test',
    'steve',
    'wilansysdemo2',
    'wilansysdemo3',
    'wildemo2',
  ]

  # Lookup the tenant identifier from the cluster spec key.
  CLUSTER_SPECS_TO_TENANT_IDENTIFIER = {
    'f4831089-da05-4029-8d02-e7fb5c24dda6' => ['default'],
    '54110718-68bd-49c1-84fe-df31f066b7d1' => ['default'],
    '0b337883-9420-4a8c-a5ff-ece297b8f4c5' => ['default'],
    'b1319003-20f6-45b8-be4f-2ef0bae92abc' => ['default'],

    '186d26fb-096e-402f-a25d-9be622074849' => ['challenge'],

    # Ouch! We've reused the same UUID for multiple cluster specs for multiple
    # tenants.  This should be fixed!
    #
    # The offending tenant/cluster specs are
    #
    #  - ansys/default/ANSYS Fluent CFD
    #  - ansys/default/ANSYS® Fluent® & NICE EnginFrame
    #  - bigvuni/default/ANSYS Fluent CFD
    #  - default/ansys-fluent-2/ANSYS® Fluent® CFD
    #  - default/ansys-fluent/ANSYS® Fluent® CFD
    #  - default/ansys-ellexus/ANSYS® Fluent® CFD
    'c132fceb-cb78-4dd9-a904-5491c9f59e84' => ['ansys', 'bigvuni', 'default'],
  }

  def process_tokens(toks)
    toks.each do |tok|
      next if reject_token?(tok)
      process_token(tok)
    end
  end

  def reject_token?(tok)
    if TAGS_TO_IGNORE.include?(tok['Tag'])
      say "WARNING Skipping token #{tok['Token']}: tag=#{tok['Tag'].inspect} (#{tok.inspect})"
      return true
    end
    if tok['ClusterSpecKeys'].nil? && tok['Status'] == 'USED'
      say "Skipping token #{tok['Token']}: Status=#{tok['Status'].inspect} and ClusterSpecKeys=#{tok['ClusterSpecKeys'].inspect}"
      return true
    end
    if tok['ClusterSpecKeys'].nil?
      say "WARNING Skipping token #{tok['Token']}: ClusterSpecKeys=#{tok['ClusterSpecKeys'].inspect} (tok: #{tok.inspect})"
      return true
    end

    return false
  end

  def process_token(tok)
    say "Processing token #{tok['Token']}"

    tenants = tenants_for_token(tok)
    if tenants.length > 1
      ::STDERR.puts "WARNING: multiple tenants for token #{tok['Token']}"
    end
    tenants.each do |tenant|
      if tenant.nil?
      ::STDERR.puts "WARNING: missing tenant for token #{tok['Token']}"
      else
        say "Creating token #{tok['Token']} (tenant=#{tenant.identifier.inspect} tag=#{tok['Tag'].inspect} cluster_spec_keys=#{tok['ClusterSpecKeys']})"
        create_token(tenant, tok)
      end
    end
  end

  def create_token(tenant, tok)
    Token.create!({
      assigned_to: tok['UsedBy'],
      created_at: tok['CreatedAt'],
      credits: credits(tenant, tok),
      name: tok['Token'],
      permitted_spec_keys: tok['ClusterSpecKeys'],
      status: tok['Status'],
      tag: tok['Tag'],
      tenant: tenant,
      migrated: true,
    })
  end

  def load_tokens(last_evaluated_key=nil)
    @dynamodb.scan(
      table_name: "FlightLaunchTokens",
      select: "ALL_ATTRIBUTES",
      # limit: 10,
      exclusive_start_key: last_evaluated_key,
    )
  end

  def tenants_for_token(tok)
    spec_keys = tok['ClusterSpecKeys']
    tenant_ids = spec_keys.map do |k|
      CLUSTER_SPECS_TO_TENANT_IDENTIFIER[k]
    end.flatten.uniq

    tenant_ids.map do |tid| Tenant.find_by(identifier: tid) end
  end

  def credits(tenant, tok)
    performance_spec_keys = [
      "0b337883-9420-4a8c-a5ff-ece297b8f4c5",
      "b1319003-20f6-45b8-be4f-2ef0bae92abc",
    ]
    spec_keys = tok['ClusterSpecKeys'] || []
    is_performance_token = spec_keys.any?{|k| performance_spec_keys.include?(k)}

    if is_performance_token
      120
    elsif tenant.identifier == 'challenge'
      4
    else
      8
    end
  end
end
